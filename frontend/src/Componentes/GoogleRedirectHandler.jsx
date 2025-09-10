import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useToast } from "../Componentes/Store/ToastContext"; // your toast hook

export default function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://food-app-d8r3.onrender.com";

  useEffect(() => {
    const handleOAuthLogin = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("OAuth session error:", error);
          showToast("❌ Failed to log in with Google", "error");
          navigate("/login");
          return;
        }

        const { session } = data;
        const user = session.user;

        // ✅ Store user info
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Assign welcome coupon
        try {
          await fetch(`${BASE_URL}/assign-new-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              name: user.user_metadata?.full_name || "Guest",
              email: user.email,
            }),
          });
        } catch (err) {
          console.error("Failed to assign coupon:", err);
        }

        showToast("🎉 Login successful!", "success");
        navigate("/home");
      } catch (err) {
        console.error("Google login failed:", err);
        showToast("❌ Failed to log in with Google", "error");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleOAuthLogin();
  }, [navigate, showToast]);

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
