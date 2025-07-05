import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const API =
  import.meta.env.VITE_API_BASE_URL || "https://food-app-d8r3.onrender.com";

export default function GoogleRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      console.log("🔁 Checking Supabase session...");

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("❌ Google session error:", error);
        alert("Google login failed.");
        return;
      }

      const { user } = session;
      const email = user.email;
      const name = user.user_metadata.full_name || "Google User";

      console.log("✅ Google user:", { email, name });
      console.log("🔗 Using API base URL:", API);

      try {
        const response = await fetch(`${API}/google-auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("❌ Google auth failed:", result);
          alert(result.error || "Google signup/login failed");
          return;
        }

        // ✅ Save token and user to localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        console.log("🎉 Google login successful:", result.user);

        // ✅ Navigate to home
        window.location.href = "/"; // or your main/home route
      } catch (err) {
        console.error("❌ Google final auth failed:", err);
        alert("Something went wrong. Please try again.");
      }
    };

    handleGoogleRedirect();
  }, [navigate]);

  return <div>Signing you in with Google...</div>;
}
