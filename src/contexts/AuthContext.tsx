import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  applyRole: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [loginTime, setLoginTime] = useState<number | null>(
    parseInt(localStorage.getItem("loginTime") || "") || null
  );

  const MAX_LOGIN_DURATION = 15 * 60 * 1000; // 30 minutes in milliseconds

  const login = (newToken: string) => {
    const currentTime = Date.now();
    setToken(newToken);
    setLoginTime(currentTime);
    localStorage.setItem("token", newToken);
    localStorage.setItem("loginTime", currentTime.toString());
  };

  const applyRole = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setLoginTime(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loginTime");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedLoginTime = parseInt(localStorage.getItem("loginTime") || "");

    if (storedRole) {
      setRole(storedRole);
    }
    if (storedToken && storedLoginTime) {
      const currentTime = Date.now();
      if (currentTime - storedLoginTime > MAX_LOGIN_DURATION) {
        logout();
      } else {
        setToken(storedToken);
        setLoginTime(storedLoginTime);
      }
    }
  }, []);

  useEffect(() => {
    if (token && loginTime) {
      const timeout = setTimeout(() => {
        logout();
      }, MAX_LOGIN_DURATION - (Date.now() - loginTime));
      return () => clearTimeout(timeout);
    }
  }, [token, loginTime]);

  return (
    <AuthContext.Provider value={{ token, login, logout, applyRole, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
