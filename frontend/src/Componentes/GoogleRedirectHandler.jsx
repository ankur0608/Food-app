"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import { toast } from "react-hot-toast";

export default function GoogleRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data?.session) {
          toast.error("❌ Google login failed. Please try again.");
          navigate("/login");
          return;
        }

        const user = data.session.user;

        // ✅ Save user in localStorage
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("🎉 Welcome back!");
        navigate("/home");

        // 🎁 Assign new user coupon in background
        fetch("https://food-app-d8r3.onrender.com/assign-new-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            name: user.user_metadata?.full_name || "Guest",
            email: user.email,
          }),
        }).catch((err) => {
          console.error("⚠️ Failed to assign coupon:", err);
          toast.error("Coupon assignment failed. Contact support.");
        });
      } catch (err) {
        console.error("Google redirect error:", err);
        toast.error("Unexpected error. Please try again.");
        navigate("/login");
      }
    };

    handleRedirect();
  }, [navigate]);

  return <p className="text-center mt-10">⏳ Finishing Google login...</p>;
}
