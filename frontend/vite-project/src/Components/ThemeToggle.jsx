import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.body;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      style={{
        background: "transparent",
        border: "none",
        fontSize: "1.5rem",
        cursor: "pointer",
        color: darkMode ? "#fff" : "#000"
      }}
      title="Toggle theme"
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
}
