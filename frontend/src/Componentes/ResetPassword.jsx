import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function ResetPassword() {
  const [accessToken, setAccessToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const tokenMatch = hash.match(/access_token=([^&]+)/);
    if (tokenMatch) {
      setAccessToken(tokenMatch[1]);
    }
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.updateUser(
      { password: newPassword },
      { accessToken }
    );

    if (error) {
      setMessage("❌ Failed to reset password: " + error.message);
    } else {
      setMessage("✅ Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔐 Reset Your Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={!accessToken || !newPassword}>
          Reset Password
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
