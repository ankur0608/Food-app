import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function ChatHeader({ namaste, onClose }) {
  return (
    <div
      style={{
        padding: "20px",
        background: "#ad8b3a",
        color: "#fff",
        fontWeight: 700,
        fontSize: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        position: "relative",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ position: "relative" }}>
          <img
            src={namaste}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: "-3px",
              top: "25px",
              width: "9px",
              height: "9px",
              backgroundColor: "#4caf50",
              borderRadius: "50%",
              border: "1px solid #fff",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontWeight: 700, fontSize: "20px" }}>ABC</span>
          <span style={{ fontWeight: 400, fontSize: "12px", color: "#f0e6d2" }}>
            Your Chat Assistant!
          </span>
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          color: "#fff",
          border: "none",
          fontSize: "28px",
          cursor: "pointer",
          position: "absolute",
          top: "16px",
          right: "16px",
        }}
      >
        <CloseIcon />
      </button>
    </div>
  );
}
