const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  // Up to 3 alert emails
  alertEmails: {
    type: [String],
    validate: [arr => arr.length <= 3, "{PATH} exceeds the limit of 3"],
  },

  // Scream detection history
  history: [
    {
      createdAt: { type: Date, default: Date.now },
      result: mongoose.Schema.Types.Mixed, // stores Flask JSON response but as moxed no validation here
      risk: String,
    },
  ],
});

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
