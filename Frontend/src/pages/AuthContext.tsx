import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

/* -------------------- TYPES -------------------- */

interface User {
  id: string;
  email: string;
  role: "operator" | "manager" | "project_manager" | "admin" | "hr";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;

  // 🔥 NEW
  loginTime: Date | null;

  setUser: (user: User | null) => void;
  setLoginTime: (time: Date | null) => void;
}
export const ROLE_ROUTES: Record<string, string[]> = {
  admin: [
    "/dashboard",
  "/admin",
  "/admin/users",
  "/admin/create-user",
],


  manager: [
    "/dashboard",
    "/manager",
     "/manager/employees",
  "/manager/performance",
    "/manager/reports",
    "/manager/hrm",
    "/timesheet"
  ],

  project_manager: [
    "/dashboard",
    "/project_manager",
    "/project_manager/employee-assignment",
    "/timesheet"
  ],

  operator: [
    "/dashboard",
    "/operator",
    "/timesheet",
    "/operator/hrm"
  ],

  hr: [
    "/dashboard",
    "/operator/hrm",
    "/manager/hrm"
  ],
};

/* -------------------- CONTEXT -------------------- */

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginTime: null,
  setUser: () => {},
  setLoginTime: () => {},
});

/* -------------------- PROVIDER -------------------- */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginTime, setLoginTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        
        const res = await axios.get(
  `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

// Normalize role from backend (ADMIN, MANAGER, etc.)
let normalizedRole = res.data.role.toLowerCase();
normalizedRole = normalizedRole
  .replace("project manager", "project_manager")
  .replace("project-manager", "project_manager");

setUser({
  id: res.data.id,
  email: res.data.email,
  role: normalizedRole as
    | "admin"
    | "manager"
    | "project_manager"
    | "operator"
    | "hr",
});

        // ❗ DO NOT set loginTime here
        // This effect runs on refresh / app mount
      } catch (error) {
        console.error("Failed to fetch user from /auth/me:", error);
        setUser(null);
        setLoginTime(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginTime,
        setUser,
        setLoginTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* -------------------- HOOK -------------------- */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export const canAccessRoute = (role: string, path: string): boolean => {
  const allowedRoutes = ROLE_ROUTES[role];
  if (!allowedRoutes) return false;

  return allowedRoutes.some(route =>
  path === route || path.startsWith(route + "/")
);

};
export const ROLE_DASHBOARD_ROUTE: Record<string, string> = {
  admin: "/admin",
  manager: "/manager",
  project_manager: "/project_manager",
  operator: "/operator",
  hr: "/operator/hrm",
};
