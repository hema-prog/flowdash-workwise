import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = () => {
    // 1️⃣ Clear stored auth data
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    // 2️⃣ Reset auth context
    setUser(null);

    // 3️⃣ Redirect to login
    navigate("/login", { replace: true });
  };

  const styles = `
    @keyframes admin-card-glow {
      0%, 100% { box-shadow: 0 0 15px rgba(147, 51, 234, 0.1); }
      50% { box-shadow: 0 0 25px rgba(147, 51, 234, 0.15); }
    }
    
    .admin-glass-card {
      animation: admin-card-glow 4s ease-in-out infinite;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(147, 51, 234, 0.15);
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.5), rgba(45, 40, 100, 0.4));
    }
    
    .admin-glass-nav {
      backdrop-filter: blur(8px);
      border-right: 1px solid rgba(147, 51, 234, 0.15);
      background: linear-gradient(180deg, rgba(25, 22, 60, 0.7), rgba(35, 32, 80, 0.6));
    }
    
    .admin-nav-item-active {
      background: linear-gradient(90deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.1));
      border-left: 3px solid rgba(147, 51, 234, 0.5);
      box-shadow: inset 0 0 10px rgba(147, 51, 234, 0.1);
    }
    
    .admin-neon-btn {
      background: linear-gradient(135deg, rgb(126, 51, 204), rgb(196, 72, 139));
      transition: all 0.3s ease;
      box-shadow: 0 0 12px rgba(147, 51, 234, 0.2);
    }
    
    .admin-neon-btn:hover {
      box-shadow: 0 0 20px rgba(147, 51, 234, 0.4);
    }
  `;

  if (typeof document !== "undefined") {
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  return (
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, rgb(20, 18, 40) 0%, rgb(30, 25, 70) 50%, rgb(35, 30, 80) 100%)'
    }}>
      
      {/* Sidebar */}
      <aside className="admin-glass-nav w-64 text-white p-6 border-r border-purple-500/10">
        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
          Dotspeaks
        </h2>

        <nav className="space-y-2">
          <Link 
            to="/admin" 
            className="admin-nav-item-active px-4 py-2 rounded-lg text-purple-100 transition-all block"
          >
            Dashboard
          </Link>

          <Link 
            to="/admin/create-user" 
            className="px-4 py-2 rounded-lg text-purple-200/70 hover:text-purple-100 hover:bg-purple-500/10 transition-all block"
          >
            Create User
          </Link>

          <Link 
            to="/admin/users" 
            className="px-4 py-2 rounded-lg text-purple-200/70 hover:text-purple-100 hover:bg-purple-500/10 transition-all block"
          >
            View Users
          </Link>

          {/* ✅ REAL LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-red-300/70 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
