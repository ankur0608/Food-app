import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function GoogleRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishGoogleLogin = async () => {
      // ⚠️ Wait for Supabase to store session
      const { data: sessionData, error: sessionErr } =
        await supabase.auth.getSession();
      if (sessionErr || !sessionData.session) {
        alert("Google login failed.");
        return navigate("/signup");
      }

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        alert("User info fetch failed.");
        return navigate("/signup");
      }

      // Proceed with backend call
      const { email, user_metadata } = userData.user;
      const username = user_metadata?.full_name || "GoogleUser";

      try {
        const res = await fetch(
          "https://food-app-d8r3.onrender.com/google-auth",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username }),
          }
        );

        const result = await res.json();
        if (!res.ok) {
          alert(result.error || "Google login failed.");
          return navigate("/signup");
        }

        localStorage.setItem("token", result.token);
        window.location.href = "/home";
      } catch (err) {
        console.error("Google final auth failed:", err);
        navigate("/signup");
      }
    };

    finishGoogleLogin();
  }, []);

  return (
    <p style={{ textAlign: "center", marginTop: "2rem" }}>
      Logging you in via Google...
    </p>
  );
}

export default GoogleRedirectHandler;
