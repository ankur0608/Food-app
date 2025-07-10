import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function Verify() {
  const [status, setStatus] = useState("⏳ Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        setStatus("❌ Verification failed or session expired.");
        return;
      }

      const { user } = session;

      if (!user.email_confirmed_at) {
        setStatus("⚠️ Email not confirmed yet.");
        return;
      }

      // Optional: Insert user into your own `users` table here
      const { data, error: insertError } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || "Anonymous",
      });

      if (insertError) {
        console.error("User DB insert error:", insertError);
      }

      setStatus("✅ Email verified successfully!");
    };

    checkSession();
  }, []);

  const handleContinue = () => {
    navigate("/login"); // or /dashboard
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{status}</h2>

      {status.includes("✅") && (
        <button onClick={handleContinue} style={{ marginTop: "1rem" }}>
          Go to Login
        </button>
      )}
    </div>
  );
}

export default Verify;
