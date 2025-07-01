import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import styles from "./ResetPassword.module.css";
import { useTheme } from "../Componentes/Store/theme.jsx";

import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isReady, setIsReady] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsReady(true);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Password updated! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.heading}>Reset Password</h1>

      {isReady ? (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className={styles.button} onClick={handleReset}>
            Update Password
          </button>
        </>
      ) : (
        <p className={styles.info}>Waiting for secure reset session...</p>
      )}

      {message && <div className={styles.successMessage}>{message}</div>}
    </div>
  );
}
