import React from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useNavigate } from "react-router-dom";

export default function MessagesList({
  messages,
  messagesEndRef,
  sendMessage,
}) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "#faf9f6",
      }}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: msg.isBot ? "flex-start" : "flex-end",
            maxWidth: "75%",
            marginLeft: msg.isBot ? 0 : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: msg.isBot ? "#e3e0ff" : "#ad8b3a",
              color: msg.isBot ? "#3e261f" : "#fff",
              padding: "12px 18px",
              borderRadius: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontWeight: 500,
              fontSize: "15px",
              marginBottom: "4px",
            }}
          >
            {msg.isBot && <SmartToyIcon style={{ fontSize: "20px" }} />}
            {msg.message}
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#666",
              marginTop: "4px",
              alignSelf: msg.isBot ? "flex-start" : "flex-end",
            }}
          >
            {`Today, ${msg.timestamp}`}
          </div>

          {msg.options && (
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                gap: "5px",
                flexWrap: "wrap",
              }}
            >
              {msg.options.map((opt, idx) => {
                const label = typeof opt === "string" ? opt : opt.label;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (
                        typeof opt === "object" &&
                        opt.type === "navigate" &&
                        opt.path
                      ) {
                        navigate(opt.path);
                      } else {
                        sendMessage(label);
                      }
                    }}
                    style={{
                      padding: "8px 16px",
                      border: "1px solid #ad8b3a",
                      background: "#fff",
                      color: "#68544eff",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease",
                      margin: "4px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ad8b3a";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.color = "#3e261f";
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
