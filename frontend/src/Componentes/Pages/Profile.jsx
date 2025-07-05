import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient.js";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get user from localStorage (for regular login)
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
      return;
    }
    // Try to get user from Supabase (for Google login)
    async function fetchSupabaseUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({
          name: data.user.user_metadata?.full_name || data.user.email,
          email: data.user.email,
          avatar: data.user.user_metadata?.avatar_url,
        });
      }
    }
    fetchSupabaseUser();
  }, []);

  if (!user) {
    return (
      <div className={styles.container}>
        <h2>Profile</h2>
        <p>Loading user info...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Your Profile</h2>
      <div className={styles.profileCard}>
        <img
          src={
            user.avatar ||
            "/assets/default-profile.png"
          }
          alt="Profile"
          className={styles.avatar}
        />
        <div className={styles.info}>
          <div>
            <strong>Name:</strong> {user.name || user.full_name || "N/A"}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
        </div>
      </div>
      <button className={styles.button} onClick={() => navigate("/meals")}>
        Back to Meals
      </button>
    </div>
  );
}