import React, { useState, useRef, useEffect } from "react";
import "./Dashboard.css";
// jere as many iobound task thats fast for mern sprinboot could br used in multithreding
export default function Dashboard() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Tap to start listening");
  const [result, setResult] = useState(null);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);// to store MediaRecorder instance
  const audioChunksRef = useRef([]);// to store chunks
  const intervalRef = useRef(null);// to store interval ID for stopping recording every 10 seconds
  const timerRef = useRef(null);// to store interval ID for timer
  const isRecordingRef = useRef(false);// to track recording state across re-renders

  const API_URL = "http://localhost:5173/api/scream/detect";

  // ⏱ Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setSeconds(0);
    }
  }, [isRecording]);

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  const sendAudioToServer = async (chunks) => {
    const audioBlob = new Blob(chunks, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");//name ,val,filename

    try {
      setStatus("Analyzing audio…");

      const response = await fetch(API_URL, {
        method: "POST",                      
        body: formData,
        credentials: "include",//for sending cookie else it wouldnot
      });

      const data = await response.json();
      setResult(data.result);

      const level = (data.result.alert_level || "NORMAL").toUpperCase();
      let emoji = "🟢";
      if (level.includes("MODERATE")) emoji = "🟠";
      if (level.includes("HIGH")) emoji = "🔴";

      setStatus(`${emoji} ${level} detected`);
    } catch {
      setStatus("❌ Analysis failed");
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });// in my project, I used the Web Audio API to capture audio from the user's microphone. The getUserMedia method prompts the user for permission and returns a MediaStream object containing the audio track. This stream is then used to create a MediaRecorder instance, which records the audio in chunks. The recorded chunks are sent to the server for scream detection analysis.
    mediaRecorderRef.current = new MediaRecorder(stream);// convert stram from microphone into chunks
    audioChunksRef.current = [];

    isRecordingRef.current = true;
    setIsRecording(true);
    setStatus("Listening…");

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      if (audioChunksRef.current.length > 0) {
        sendAudioToServer(audioChunksRef.current);
        audioChunksRef.current = [];
      }
      if (isRecordingRef.current) mediaRecorderRef.current.start();
    };

    mediaRecorderRef.current.start();//start capturing

    intervalRef.current = setInterval(() => {
      if (mediaRecorderRef.current && isRecordingRef.current) {
        mediaRecorderRef.current.stop();
      }
    }, 10000);
  };

  const stopRecording = () => {
    clearInterval(intervalRef.current);
    isRecordingRef.current = false;
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    setStatus("Stopped");
  };

  return (
    <div className="screen">
      <div className="voice-card">
        <h3 className="title">Voice Broadcast</h3>

        {/* Circle Timer */}
        <div className={`circle ${isRecording ? "active" : ""}`}>
          <span>{formatTime(seconds)}</span>
        </div>

        {/* Fake waveform */}
        <div className={`waveform ${isRecording ? "animate" : ""}`}>
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        {/* Controls */}
        <button
          className="control-btn"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "⏸" : "▶"}
        </button>

        <p className="status">{status}</p>
      </div>
    </div>
  );
}
//for save creare doc-validation-defaultvalue-middleware-store in mongodb
//insert one no doc instance created
//multer detrct boundry extract file save file
//scalabilty??? queue and many qies related to that
// in multer if file in ram req.file.buffer if file in disk req.file.path