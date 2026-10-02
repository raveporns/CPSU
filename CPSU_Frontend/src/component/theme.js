import React, { useState } from "react";
import "../css/theme.css";

function Theme() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.className = isDark ? "light-mode" : "dark-mode"; 
  };

  return (
    <div
      className={`toggle-switch ${isDark ? "dark" : "light"}`}
      onClick={toggleTheme}
    >
      <div className="icon sun">☀️</div>
      <div className="icon moon">🌙</div>
      <div className={`switch-thumb ${isDark ? "dark" : "light"}`}></div>
    </div>
  );
}

export default Theme;
