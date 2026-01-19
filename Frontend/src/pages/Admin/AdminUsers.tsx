import { useEffect, useState } from "react";
import axios from "axios";
import { Users, AlertCircle } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
  enabled: boolean;
}

const roles = [
  "ADMIN",
  "MANAGER",
  "OPERATOR",
  "PROJECT_MANAGER",
];


const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // 🔁 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(res.data);
      } catch (error) {
        alert("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔁 Enable / Disable user
  const toggleUserStatus = async (userId: string) => {
    try {
      const res = await axios.patch(
        `http://localhost:4000/api/users/${userId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = res.data;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    } catch (error) {
      alert("Failed to update user status");
    }
  };

  // 🔽 CHANGE ROLE
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdatingUserId(userId);

      const res = await axios.patch(
        `http://localhost:4000/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = res.data;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    } catch (error) {
      alert("Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) return (
    <div className="text-purple-200/60 text-center py-12">
      Loading users...
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Users size={28} className="text-purple-400" />
          All Users
        </h2>
        <p className="text-purple-200/60 text-sm">
          Manage system users, roles, and permissions
        </p>
      </div>

      {users.length === 0 ? (
        <div className="admin-glass-card p-8 rounded-2xl border border-purple-500/15 text-center">
          <AlertCircle size={32} className="text-purple-300/50 mx-auto mb-3" />
          <p className="text-purple-200/60">No users found</p>
        </div>
      ) : (
        <div className="admin-glass-card rounded-2xl border border-purple-500/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-950/30 border-b border-purple-500/15">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-purple-200">Email</th>
                  <th className="text-left px-6 py-4 font-semibold text-purple-200">Role</th>
                  <th className="text-left px-6 py-4 font-semibold text-purple-200">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-purple-200">Change Role</th>
                  <th className="text-center px-6 py-4 font-semibold text-purple-200">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-500/15">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-purple-500/10 transition-colors">
                    <td className="px-6 py-4 text-purple-100">{user.email}</td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-red-950/40 text-red-300 border border-red-500/30"
                          : user.role === "MANAGER"
                          ? "bg-blue-950/40 text-blue-300 border border-blue-500/30"
                          : user.role === "PROJECT_MANAGER"
                          ? "bg-purple-950/40 text-purple-300 border border-purple-500/30"
                          : "bg-green-950/40 text-green-300 border border-green-500/30"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.enabled
                          ? "bg-green-950/40 text-green-300 border border-green-500/30"
                          : "bg-orange-950/40 text-orange-300 border border-orange-500/30"
                      }`}>
                        {user.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>

                    {/* 🔽 Role Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={updatingUserId === user.id}
                        onChange={(e) =>
                          updateUserRole(user.id, e.target.value)
                        }
                        className="admin-form-input px-3 py-1 rounded-lg text-sm disabled:opacity-50"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Enable / Disable */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`px-4 py-1 rounded-lg text-sm font-semibold transition-all ${
                          user.enabled
                            ? "admin-neon-btn text-white"
                            : "bg-green-950/40 text-green-300 border border-green-500/30 hover:bg-green-950/60"
                        }`}
                      >
                        {user.enabled ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
