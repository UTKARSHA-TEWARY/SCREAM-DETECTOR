const FormData = require("form-data");

const screamDetection = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Audio file required" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔄 Prepare file to send as form-data to the external AI API
    const formData = new FormData();
    formData.append("audio", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post("https://guardian-02.onrender.com/predict", formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const result = response.data;
    req.screamResult = result;

    // Save detection history
    user.history.push({
      result,
      risk: result.alert || (result.scream_detected ? "HIGH" : "LOW"),
    });
    await user.save();

    // Send alerts
    if (result.alert === "HIGH" || result.scream_detected) {
      await sendAlertEmails(user.alertEmails, user.name);
    }

    next();
  } catch (error) {
    console.error("Error in scream detection middleware:", error.message);
    res.status(500).json({ error: "Scream detection failed" });
  }
};
