import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient.js";
import { useTheme } from "../Store/theme.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", avatar: "" });
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const localUser = localStorage.getItem("user");

    if (localUser) {
      const parsed = JSON.parse(localUser);
      setUser(parsed);
      setFormData({
        name: parsed.name || "",
        avatar: parsed.avatar || "",
      });
    } else {
      async function fetchSupabaseUser() {
        const {
          data: { user: supaUser },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error("❌ Supabase getUser error:", error.message);
          return;
        }

        if (supaUser) {
          const updatedUser = {
            name: supaUser.user_metadata?.full_name || supaUser.email,
            email: supaUser.email,
            avatar: supaUser.user_metadata?.avatar_url || "",
          };
          setUser(updatedUser);
          setFormData({
            name: updatedUser.name,
            avatar: updatedUser.avatar,
          });
        }
      }

      fetchSupabaseUser();
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

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

    // Optional: update metadata in Supabase
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: formData.name,
        avatar_url: formData.avatar,
      },
    });
    if (error) {
      console.error("❌ Failed to update user:", error.message);
    }

    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className={`${styles.container} ${theme === "dark" ? "dark" : ""}`}>
        <h2>Profile</h2>
        <p>Loading user info...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${theme === "dark" ? "dark" : ""}`}>
      <h2>Your Profile</h2>
      <div className={styles.profileCard}>
        <img
          src={formData.avatar || "/assets/default-profile.png"}
          alt="Profile"
          className={styles.avatar}
        />
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
        <button className={styles.button} onClick={() => navigate("/meals")}>
          Back to Meals
        </button>
      </div>
    </div>
  );
}
