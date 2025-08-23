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
        // Get current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("OAuth session error:", error);
          alert("Failed to log in with Google");
          navigate("/login");
          return;
        }

        const { user, access_token } = session;

        // Save token and user info locally
        localStorage.setItem("token", access_token);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("justSignedUp", "true");

        // You can also access user's metadata if needed
        // Example: user.user_metadata.full_name

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
