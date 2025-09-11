import React from "react";
import SendIcon from "@mui/icons-material/Send";
import HomeIcon from "@mui/icons-material/Home";

export default function ChatInput({
  newMsg,
  setNewMsg,
  sendMessage,
  resetChat,
}) {
  return (
    <div
      style={{
        display: "flex",
        padding: "16px 20px",
        borderTop: "1px solid #d4c5b3",
        background: "#faf9f6",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <button
        onClick={resetChat}
        style={{
          padding: "10px",
          borderRadius: "50%",
          background: "#ad8b3a",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(173, 139, 58, 0.4)",
        }}
      >
        <HomeIcon style={{ fontSize: "24px" }} />
      </button>

      <input
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Type your message..."
        style={{
          flex: 1,
          padding: "14px 20px",
          borderRadius: "30px",
          border: "2px solid #ad8b3a",
          outline: "none",
          fontSize: "15px",
        }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage(newMsg)}
      />

      <button
        onClick={() => sendMessage(newMsg)}
        style={{
          padding: "12px",
          borderRadius: "50%",
          background: "#ad8b3a",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(173, 139, 58, 0.4)",
        }}
      >
        <SendIcon />
      </button>
    </div>
  );
}
