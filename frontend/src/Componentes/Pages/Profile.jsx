import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient.js";
import { useTheme } from "../Store/theme.jsx";
import Avatar from "@mui/material/Avatar";
export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", avatar: "" });
  const navigate = useNavigate();
  const { theme } = useTheme();
  useEffect(() => {
    const fetchUser = async () => {
      const { data: supaUserData, error } = await supabase.auth.getUser();

      if (error || !supaUserData?.user) {
        console.error("❌ Supabase getUser error:", error?.message);
        return;
      }

      const supaUser = supaUserData.user;

      // Always fetch from `users` table to ensure it's up-to-date
      const { data: userRow, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", supaUser.id)
        .single();

      // If user not found, create one
      if (!userRow && !userError) {
        const { name, avatar_url } = supaUser.user_metadata || {};
        await supabase.from("users").insert([
          {
            id: supaUser.id,
            name: name || supaUser.email,
            email: supaUser.email,
            avatar: avatar_url || "",
          },
        ]);
      }

      const currentUser = {
        id: supaUser.id,
        email: supaUser.email,
        name: userRow?.name || supaUser.user_metadata?.name || supaUser.email,
        avatar: userRow?.avatar || supaUser.user_metadata?.avatar_url || "",
      };

      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        avatar: currentUser.avatar,
      });

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
    const updatedUser = {
      ...user,
      name: formData.name,
      avatar: formData.avatar,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: formData.name,
        avatar_url: formData.avatar,
      },
    });

    if (authError) {
      console.error("❌ Supabase auth update error:", authError.message);
    }

    // Optional: update 'users' table as well
    await supabase
      .from("users")
      .update({
        name: formData.name,
        avatar: formData.avatar,
      })
      .eq("id", user.id);

    setIsEditing(false);
  };

  const stringToInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return (
      <div
        className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}
      >
        <h2>Profile</h2>
        <p>Loading user info...</p>
      </div>
    );
  }
  const avatarSrc = formData.avatar?.trim();

  return (
    <div
      className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}
    >
      <h2>Your Profile</h2>
      <div className={styles.profileCard}>
        {avatarSrc ? (
          <Avatar src={avatarSrc} sx={{ width: 64, height: 64 }} />
        ) : (
          <Avatar sx={{ width: 64, height: 64, bgcolor: "#1976d2" }}>
            {stringToInitials(formData.name || "U")}
          </Avatar>
        )}

        <div className={styles.info}>
          {isEditing ? (
            <>
              <div>
                <strong>Name:</strong>{" "}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <strong>Avatar URL:</strong>{" "}
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>Name:</strong> {user.name || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button
          className={styles.button}
          onClick={isEditing ? handleSave : handleEditToggle}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
        <button className={styles.button} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}
