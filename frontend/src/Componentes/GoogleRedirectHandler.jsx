// src/pages/GoogleRedirectHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function GoogleRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthLogin = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        alert("Failed to log in with Google");
        navigate("/login");
        return;
      }

      const { user, access_token } = data.session;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("justSignedUp", "true");

      // Insert into 'users' table if not exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single();

      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            email: user.email,
            name: user.user_metadata.full_name || user.email,
            password: null,
          },
        ]);
        if (insertError) console.error("Insert failed", insertError);
      }

      navigate("/home");
      window.location.reload();
    };

    handleOAuthLogin();
  }, [navigate]);

  return <div>Logging you in via Google...</div>;
}

export default GoogleRedirectHandler;
