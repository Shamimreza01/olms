import { createContext, useContext, useEffect, useState } from "react";
import api, { setLogoutHandler } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load logged-in user
  const fetchMe = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  // Login
  const login = async ({ email, password }) => {
    await api.post("/auth/login", {
      email,
      password,
    });
    const { data } = await api.get("/auth/me");
    setUser(data.user || null);
    return data.user;
  };

  // Register Student
  const registerStudent = async ({ name, email, password, classId }) => {
    const { data } = await api.post("/auth/register/student", {
      name,
      email,
      password,
      classId,
    });
    return data;
  };

  // Register Teacher
  const registerTeacher = async ({ name, email, password, secretKey }) => {
    const { data } = await api.post("/auth/register/teacher", {
      name,
      email,
      password,
      secretKey,
    });
    return data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      setUser(null);
    }
  };

  // Register logout handler for axios interceptor
  useEffect(() => {
    setLogoutHandler(logout);
    return () => {
      setLogoutHandler(null);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerStudent,
        registerTeacher,
        logout,
        fetchMe,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
