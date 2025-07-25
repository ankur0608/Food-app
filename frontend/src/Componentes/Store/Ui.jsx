import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient.js";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [user, setUser] = useState(null); // ⬅️ NEW

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // ✅ Fetch user from Supabase
      supabase.auth.getUser().then(({ data, error }) => {
        if (data?.user) {
          setUser(data.user);
        }
      });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setJustSignedUp(false);
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  const markJustSignedUp = () => {
    setJustSignedUp(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        justSignedUp,
        markJustSignedUp,
        user,
      }} // ⬅️ Expose user
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
