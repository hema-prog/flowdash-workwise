import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  LayoutDashboard,
  Clock,
  CheckSquare,
  FileText,
  LogOut,
} from "lucide-react";

const styles = `
  @keyframes float-particle {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
    25% { transform: translateY(-20px) translateX(10px); opacity: 0.4; }
    50% { transform: translateY(-40px) translateX(0); opacity: 0.2; }
    75% { transform: translateY(-20px) translateX(-10px); opacity: 0.4; }
  }
  
  .particle {
    animation: float-particle linear infinite;
  }
  .glass-nav {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(168, 85, 247, 0.2);
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 27, 75, 0.6));
  }
  .nav-item-active {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.3));
    border-left: 3px solid rgba(168, 85, 247, 0.8);
  }
  .nav-item-hover {
    transition: all 0.3s ease;
  }
  .nav-item-hover:hover {
    background: rgba(168, 85, 247, 0.2);
    transform: translateX(2px);
  }
  .glass-info {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(168, 85, 247, 0.2);
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 27, 75, 0.5));
  }
`;

if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

const OperatorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
const isActive = (path: string) => {
  return location.pathname === path;
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 rounded-full bg-purple-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* LEFT SIDEBAR */}
      <aside className="w-64 glass-nav flex flex-col justify-between h-full overflow-hidden relative z-10 border-r border-purple-500/20">
        {/* TOP SECTION */}
        <div>
          {/* Logo */}
          <div className="px-6 py-5 border-b border-purple-500/20">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dotspeaks
            </h1>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-6 space-y-2">
            <Link
              to="/operator"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition nav-item-hover ${
                isActive("/operator")
                  ? "nav-item-active text-purple-300"
                  : "text-purple-200/70"
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/operator/timesheet"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition nav-item-hover ${
                isActive("/operator/timesheet")
                  ? "nav-item-active text-purple-300"
                  : "text-purple-200/70"
              }`}
            >
              <Clock size={18} />
              Timesheet
            </Link>

            <Link
              to="/operator/tasks"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition nav-item-hover ${
                isActive("/operator/tasks")
                  ? "nav-item-active text-purple-300"
                  : "text-purple-200/70"
              }`}
            >
              <CheckSquare size={18} />
              My Tasks
            </Link>

            <Link
              to="/operator/documents"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition nav-item-hover ${
                isActive("/operator/documents")
                  ? "nav-item-active text-purple-300"
                  : "text-purple-200/70"
              }`}
            >
              <FileText size={18} />
              Documents
            </Link>
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="px-4 pb-6">
          {/* Operator Info Card */}
          <div className="glass-info rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-purple-300">
              Operator
            </p>
            <p className="text-xs text-purple-200/70 truncate">
              {user?.email}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto relative z-5">
        <Outlet />
      </main>
    </div>
  );
};

export default OperatorLayout;
