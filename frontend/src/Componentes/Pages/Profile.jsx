import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { useTheme } from "../Store/theme.jsx";

// MUI imports
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", avatar: "" });
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
      setFormData({ name: storedUser.name, avatar: storedUser.avatar });
    }

    const fetchUser = async () => {
      const { data: supaUserData } = await supabase.auth.getUser();
      const supaUser = supaUserData?.user;
      if (!supaUser) return;

      const { data: userRow } = await supabase
        .from("users")
        .select("*")
        .eq("id", supaUser.id)
        .single();

      const currentUser = {
        id: supaUser.id,
        email: supaUser.email,
        name: userRow?.name || supaUser.user_metadata?.name || supaUser.email,
        avatar:
          userRow?.avatar ||
          supaUser.user_metadata?.avatar_url ||
          supaUser.user_metadata?.picture ||
          "",
      };

      setUser(currentUser);
      setFormData({ name: currentUser.name, avatar: currentUser.avatar });
      localStorage.setItem("user", JSON.stringify(currentUser));
    };

    fetchUser();
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    await supabase.auth.updateUser({
      data: { name: formData.name, avatar_url: formData.avatar },
    });
    await supabase
      .from("users")
      .update({ name: formData.name, avatar: formData.avatar })
      .eq("id", user.id);

    setIsEditing(false);
  };

  const stringToInitials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme === "dark" ? "#121212" : "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const avatarSrc = formData.avatar?.trim();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 5,
        px: 2,
        mt: 10,
        bgcolor: theme === "dark" ? "#121212" : "#fff",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          textAlign: "center",
          bgcolor: theme === "dark" ? "#1e1e1e" : "#fff",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={3}>
          Your Profile
        </Typography>

        <Avatar
          src={avatarSrc || undefined}
          sx={{
            width: 80,
            height: 80,
            bgcolor: !avatarSrc ? "#1976d2" : "transparent",
            fontSize: 32,
            mb: 2,
            mx: "auto",
          }}
        >
          {!avatarSrc && stringToInitials(formData.name || "U")}
        </Avatar>

        <Stack spacing={2} mt={2}>
          {isEditing ? (
            <>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Avatar URL"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                fullWidth
              />
            </>
          ) : (
            <>
              <Typography variant="body1">
                <strong>Name:</strong> {user.name || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
            </>
          )}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          <Button
            variant="contained"
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={isEditing ? handleSave : handleEditToggle}
            sx={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5, #4338ca)",
              },
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
