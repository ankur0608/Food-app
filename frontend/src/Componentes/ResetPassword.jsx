import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useToast } from "./Store/ToastContext";

// MUI imports
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function ResetPassword() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        showToast(error.message || "Password reset failed", "error");
        return;
      }
      showToast("✅ Password reset successful! Please login.", "success");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      showToast("❌ Something went wrong. Try again.", "error");
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
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* New Password */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  label="New Password"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showConfirm ? "text" : "password"}
                  label="Confirm Password"
                  variant="outlined"
                  placeholder="Re-enter new password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirm(!showConfirm)}
                          edge="end"
                        >
                          {showConfirm ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
