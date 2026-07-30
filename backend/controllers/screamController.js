const axios = require("axios");
const FormData = require("form-data");
const User = require("../models/User");
const sendAlertEmail = require("../utils/sendAlertEmail");

// Main scream detection handler
exports.handleScreamDetection = async (req, res) => {
  console.log("🎤 Received file:", req.file);

   try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio uploaded" });
    }

    // Prepare audio data for Flask API
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      knownLength: req.file.size,
    });// filename must match the expected parameter name in Flask endpoint,actual data is in req.file.buffer,metadata like originalname and mimetype are included for Flask to process correctly

    const flaskUrl = "https://guardian-02.onrender.com/predict";

    // Send audio to Flask AI endpoint
    let flaskResponse;
    try {
      flaskResponse = await axios.post(flaskUrl, formData, {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        timeout: 100000, // 20 sec
      });//Content-Type

//Tells the server what format the request body is Tells the server what response format the client wants.
//axios.get("/profile", {
 // headers: {
   // Authorization: `Bearer ${token}`
 // }
//});
//Accept: application/json
//HTTP headers are metadata sent with every request and response. They tell the receiver how to process the message. For example, Content-Type specifies whether the body contains JSON or a file upload, Authorization carries authentication tokens, and Content-Length specifies the body size. In my project, I used formData.getHeaders() so Axios automatically sends the correct Content-Type: multipart/form-data h
    } catch (err) {
      console.warn("⚠️ Flask request failed:", err.message);
      return res.status(500).json({ error: "Flask service unavailable" });
    }
//A Bearer token is an access token issued after a user logs in successfully. It is included in the Authorization header stored in local storage or memory of API requests to authenticate the user. The server verifies the token to ensure the request is from an authorized user. In my project, I used JWT tokens stored in cookies for authentication, and the server checks the token on each request to protected endpoints.
    const result = flaskResponse.data;
    console.log("✅ Flask response received:", result);

    // Normalize alert level
    const alertNormalized = (result.alert_level || "No Alert").toUpperCase();

    // Fetch user
    const user = await User.findById(req.userId).select("name alertEmails history");

    // Use user-provided emails or fallback to default email
    const emails = (user?.alertEmails && user.alertEmails.length > 0)
      ? user.alertEmails
      :["utkarsha7781@gmail.com"]; // Default email if none provided

    if (emails.length > 0) {
      try {
        await sendAlertEmail(emails, user?.name || "User", alertNormalized);
        console.log("📧 Alert email sent to:", emails.join(", "));
      } catch (emailErr) {
        console.error("❌ Failed to send alert email:", emailErr.message);
      }
    }

    // Save detection history
    if (user) {
      if (!Array.isArray(user.history)) user.history = []; // <-- FIX: initialize if undefined
      user.history.push({
        result,
        risk: alertNormalized,
      });
      await user.save();
    }

    // Respond to frontend
    res.json({
      success: true,
      result,
      emailSentTo: emails,
    });

  } catch (err) {
    console.error("❌ Error during scream detection:", err.message);
    res.status(500).json({ error: "Scream detection failed" });
  }
};
