import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useToast } from "./Store/ToastContext";

// MUI imports
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
} from "@mui/material";

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { showToast } = useToast();

  const onSubmit = async ({ email }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        showToast(error.message || "Failed to send reset link", "error");
        return;
      }

      showToast(" Password reset link sent! Check your email.", "success");
    } catch {
      showToast(" Something went wrong. Please try again.", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        // background: "linear-gradient(135deg, #6366f1, #4f46e5)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 3,
          backdropFilter: "blur(12px)",
        }}
      >
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
          Forgot Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              sx={{
                py: 1.2,
                fontWeight: 600,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5, #4338ca)",
                },
              }}
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>

            {/* Back to login */}
            <Link
              component={RouterLink}
              to="/login"
              textAlign="center"
              sx={{ display: "block", mt: 1, color: "#2563eb" }}
            >
              Back to login
            </Link>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
