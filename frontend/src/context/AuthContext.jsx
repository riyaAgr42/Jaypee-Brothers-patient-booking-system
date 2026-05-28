import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCurrentUser, loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("docease-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        const nextUser = { ...user, ...response.user };
        setUser(nextUser);
        localStorage.setItem("docease-user", JSON.stringify(nextUser));
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("docease-user", JSON.stringify(userData));
  };

  const register = async (formData) => {
    const response = await registerUser(formData);
    saveUser(response.user);
    toast.success(response.message);
    return response.user;
  };

  const login = async (formData) => {
    const response = await loginUser(formData);
    saveUser(response.user);
    toast.success(response.message);
    return response.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("docease-user");
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
