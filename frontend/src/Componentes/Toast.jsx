import { useEffect, useState } from "react";
import "./Toast.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

export default function Toast({
  message,
  type = "success",
  duration = 5000,
  onClose,
}) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), duration - 300);
    const removeTimer = setTimeout(onClose, duration);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  const renderIcon = () => {
    if (type === "success") return <CheckCircleIcon className="toast-icon" />;
    if (type === "error") return <ErrorIcon className="toast-icon" />;
    if (type === "info") return <InfoIcon className="toast-icon" />;
  };

  return (
    <div className={`toast ${type} ${hide ? "hide" : ""}`}>
      {renderIcon()}
      <span className="toast-message">{message}</span>
    </div>
  );
}
