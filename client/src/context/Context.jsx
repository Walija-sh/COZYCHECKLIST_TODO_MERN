import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const todoAppContext = createContext();

export const ToDoAppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // ✅ STATE (React must own auth data)
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ SINGLE SOURCE OF TRUTH
  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setUser(res.data.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RUN ON APP LOAD (THIS IS CRITICAL)
  useEffect(() => {
    getCurrentUser();
  }, []);

//   handle auth
const handleAuthentication = async (email, password,type) => {
  try {
    const url =
      type === "signup"
        ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`
        : `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`;

    const res = await axios.post(
      url,
      { email, password },
      { withCredentials: true }
    );

    if (res.data.success) {
     

      //  tell context to re-check auth from /me
      await getCurrentUser();

      //  navigate AFTER context updates
      navigate("/");
    }
  } catch (err) {
   console.log(err);
   
    const message =
      err?.response?.data?.message || "Authentication failed";
    toast.error(message);
  }
};

  //  LOGOUT = CLEAR EVERYTHING
  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setUser(null);
        setIsLoggedIn(false);
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  //  DO NOT expose setters that allow fake login
  const contextValue = {
    user,
    isLoggedIn,
    loading,
    handleLogout,
     getCurrentUser, // useful after login/register
    handleAuthentication
  };

  return (
    <todoAppContext.Provider value={contextValue}>
      {children}
    </todoAppContext.Provider>
  );
};
