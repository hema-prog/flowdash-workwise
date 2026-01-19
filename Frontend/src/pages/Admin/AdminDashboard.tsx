import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3 } from "lucide-react";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  disabledUsers: number;
  managers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const res = await axios.get(
  `${API_BASE_URL}/users/admin/stats`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);


        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <BarChart3 size={32} className="text-purple-400" />
          Admin Dashboard
        </h1>

        <p className="text-purple-200/60 text-sm">
          System overview and user management
        </p>
      </div>

      {/* 🔢 ANALYTICS CARDS */}
      {loading ? (
        <div className="text-purple-200/60 text-center py-12">Loading dashboard stats...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="admin-glass-card p-6 rounded-2xl border border-purple-500/15">
            <h3 className="text-sm text-purple-300/60 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            <p className="text-xs text-purple-300/40 mt-2">system users</p>
          </div>

          <div className="admin-glass-card p-6 rounded-2xl border border-purple-500/15">
            <h3 className="text-sm text-purple-300/60 mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-green-300">
              {stats.activeUsers}
            </p>
            <p className="text-xs text-green-300/50 mt-2">currently active</p>
          </div>

          <div className="admin-glass-card p-6 rounded-2xl border border-purple-500/15">
            <h3 className="text-sm text-purple-300/60 mb-2">Disabled Users</h3>
            <p className="text-3xl font-bold text-orange-300">
              {stats.disabledUsers}
            </p>
            <p className="text-xs text-orange-300/50 mt-2">disabled access</p>
          </div>

          <div className="admin-glass-card p-6 rounded-2xl border border-purple-500/15">
            <h3 className="text-sm text-purple-300/60 mb-2">Managers</h3>
            <p className="text-3xl font-bold text-purple-300">
              {stats.managers}
            </p>
            <p className="text-xs text-purple-300/40 mt-2">management users</p>
          </div>
        </div>
      ) : (
        <div className="text-orange-300/60 text-center py-12">Failed to load stats</div>
      )}

      {/* 🔗 QUICK ACTIONS */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="admin-glass-card p-6 rounded-2xl border border-purple-500/15 hover:border-purple-500/25 transition-all cursor-pointer group">
            <h3 className="font-semibold text-purple-100 group-hover:text-white transition-colors">Create Users</h3>
            <p className="text-sm text-purple-200/60 mt-1 group-hover:text-purple-200/80 transition-colors">
              Add new employees or managers
            </p>
          </div>

          <div className="admin-glass-card p-6 rounded-2xl border border-purple-500/15 hover:border-purple-500/25 transition-all cursor-pointer group">
            <h3 className="font-semibold text-purple-100 group-hover:text-white transition-colors">View Users</h3>
            <p className="text-sm text-purple-200/60 mt-1 group-hover:text-purple-200/80 transition-colors">
              Manage all system users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
