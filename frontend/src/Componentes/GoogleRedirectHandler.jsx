// src/Componentes/GoogleRedirectHandler.jsx
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

        const { session } = data;
        localStorage.setItem("token", session.access_token);
        localStorage.setItem("user_email", session.user.email);

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
    >
      {loading && <CircularProgress />}
      <Typography variant="h6" mt={2}>
        Logging you in via Google...
      </Typography>
    </Box>
  );
}
