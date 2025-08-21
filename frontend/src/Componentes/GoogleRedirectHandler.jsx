// src/pages/GoogleRedirectHandler.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthLogin = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("OAuth session error:", error);
          alert("Failed to log in with Google");
          navigate("/login");
          return;
        }

        const { user, access_token } = data.session;

        // Save token and user info
        localStorage.setItem("token", access_token);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("justSignedUp", "true");

        // Check if user exists in 'users' table
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        // Insert user only if not exists
        if (!existingUser) {
          const { error: insertError } = await supabase.from("users").insert([
            {
              email: user.email,
              name: user.user_metadata.full_name || user.email,
              password: null,
            },
          ]);

          if (insertError) console.error("Failed to insert user:", insertError);
        }

        // Redirect to home after successful login
        navigate("/home");
      } catch (err) {
        console.error("Google login failed:", err);
        alert("Failed to log in with Google");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleOAuthLogin();
  }, [navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      textAlign="center"
      px={2}
    >
      {loading && <CircularProgress />}
      <Typography variant="h6" mt={2}>
        Logging you in via Google...
      </Typography>
    </Box>
  );
}
