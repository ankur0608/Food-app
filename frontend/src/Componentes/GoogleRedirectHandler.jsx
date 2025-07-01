import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const API = import.meta.env.VITE_API_BASE_URL;

export default function GoogleRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("Google session error:", error);
        alert("Google login failed");
        return;
      }

      const { user } = session;
      const email = user.email;
      const name = user.user_metadata.full_name || "Google User";

      try {
        const response = await fetch(`${API}/google-auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Google auth failed:", result);
          alert(result.error || "Google signup/login failed");
          return;
        }

        // ✅ Save token and user in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // ✅ Navigate to home/dashboard
        navigate("/Home");
      } catch (err) {
        console.error("Google final auth failed:", err);
        alert("Something went wrong.");
      }
    };

    handleGoogleRedirect();
  }, [navigate]);

  return <div>Signing you in with Google...</div>;
}
