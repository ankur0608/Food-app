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
        // Get the session after redirect
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("OAuth session error:", error);
          alert("Google login failed. Please try again.");
          navigate("/login");
          return;
        }

        const session = data.session;
        const user = session.user;

        // Save token and user info locally
        localStorage.setItem("token", session.access_token);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("justSignedUp", "true");

        // Redirect to home after successful login
        navigate("/home");
      } catch (err) {
        console.error("Google login failed:", err);
        alert("Google login failed. Please try again.");
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
