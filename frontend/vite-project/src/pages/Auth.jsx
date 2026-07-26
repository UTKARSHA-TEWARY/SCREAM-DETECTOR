import { useState } from "react";
import "../index.css";
import ThemeToggle from "../Components/ThemeToggle";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emergency1, setEmergency1] = useState("");
  const [emergency2, setEmergency2] = useState("");

  const toggleForm = () => setIsSignUp((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = isSignUp
      ? {
          name,
          email,
          password,
          alertEmails: [emergency1, emergency2].filter(email => email.trim() !== "")
        }
      : { email, password };

    try {
      const res = await fetch(
        isSignUp
          ? "https://scream-detector.onrender.com/api/auth/signup"
          : "https://scream-detector.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ✅ needed for cookies
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Authentication failed");
      } else {
        alert("Success!");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="theme-toggle top-toggle">
        <ThemeToggle />
      </div>

      <div className="auth-card">
        <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              required
            />
          )}
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
          {isSignUp && (
            <div className="alert-emails">
              <input
                type="email"
                placeholder="Alert Email 1 (optional)"
                value={emergency1}
                onChange={(e) => setEmergency1(e.target.value)}
                className="auth-input"
              />
              <input
                type="email"
                placeholder="Alert Email 2 (optional)"
                value={emergency2}
                onChange={(e) => setEmergency2(e.target.value)}
                className="auth-input"
              />
            </div>
          )}
          <button type="submit" className="auth-button">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p className="toggle-text">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button onClick={toggleForm} className="toggle-link">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
