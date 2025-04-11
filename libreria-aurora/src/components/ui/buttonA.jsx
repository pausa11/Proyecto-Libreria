import React from "react";

function ButtonA({ text, onClick, width, color, disabled = false, icon }) {
  const buttonStyle = {
    width: width,
    backgroundColor: color,
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  return (
    <button
      style={buttonStyle}
      onClick={disabled ? null : onClick}
      disabled={disabled}
      className="min-h-[5vh] rounded-[.7vw] text-white text-[min(1vw,14px)] font-[500] flex items-center justify-center transition-all duration-300 hover:opacity-90"
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
}

export default ButtonA;