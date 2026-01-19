import axios from "axios";
import { useState } from "react";
import { User, Lock, Shield } from "lucide-react";

const AdminCreateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:4000/api/auth/register", {
        email,
        password,
        role: role.toUpperCase(),
      });

      setMessage("✓ User created successfully");

      setEmail("");
      setPassword("");
      setRole("manager");

      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage(error?.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    .admin-form-input {
      background: rgba(30, 27, 75, 0.6);
      border: 1px solid rgba(147, 51, 234, 0.25);
      color: white;
      transition: all 0.3s ease;
    }
    
    .admin-form-input:focus {
      background: rgba(45, 40, 100, 0.7);
      border-color: rgba(147, 51, 234, 0.5);
      box-shadow: 0 0 15px rgba(147, 51, 234, 0.15);
      outline: none;
    }
    
    .admin-form-input::placeholder {
      color: rgba(147, 51, 234, 0.4);
    }
  `;

  if (typeof document !== "undefined") {
    if (!document.querySelector("#admin-form-styles")) {
      const styleEl = document.createElement("style");
      styleEl.id = "admin-form-styles";
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }
  }

  return (
    <div className="max-w-md">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <User size={28} className="text-purple-400" />
          Create User
        </h2>
        <p className="text-purple-200/60 text-sm">Add new user to system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
            className="admin-form-input w-full px-4 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            <Lock size={14} className="inline mr-1" />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="admin-form-input w-full px-4 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            <Shield size={14} className="inline mr-1" />
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="admin-form-input w-full px-4 py-2 rounded-lg"
          >
            <option value="manager">Manager</option>
            <option value="operator">Operator</option>
            <option value="project_manager">Project Manager</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="admin-neon-btn w-full text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.includes("✓") 
            ? "bg-green-950/40 border border-green-500/30 text-green-300" 
            : "bg-orange-950/40 border border-orange-500/30 text-orange-300"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminCreateUser;
