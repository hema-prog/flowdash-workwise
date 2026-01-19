import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, TrendingUp, Briefcase, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";

const styles = `
  @keyframes float-particle {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
    25% { transform: translateY(-20px) translateX(10px); opacity: 0.4; }
    50% { transform: translateY(-40px) translateX(0); opacity: 0.2; }
    75% { transform: translateY(-20px) translateX(-10px); opacity: 0.4; }
  }
  @keyframes card-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.2), 0 0 40px rgba(59, 130, 246, 0.1); }
    50% { box-shadow: 0 0 35px rgba(168, 85, 247, 0.35), 0 0 60px rgba(59, 130, 246, 0.2); }
  }
  @keyframes btn-glow {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.3)); }
    50% { filter: drop-shadow(0 0 15px rgba(236, 72, 153, 0.6)); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .particle {
    animation: float-particle linear infinite;
  }
  .glass-card {
    animation: card-glow 3s ease-in-out infinite;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(168, 85, 247, 0.2);
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 27, 75, 0.5));
  }
  .glass-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(168, 85, 247, 0.4) !important;
  }
  .neon-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  .neon-btn:hover {
    animation: btn-glow 0.6s ease-in-out infinite;
    transform: translateY(-2px);
  }
  .neon-input:focus {
    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.3), 0 0 20px rgba(168, 85, 247, 0.6), inset 0 0 10px rgba(168, 85, 247, 0.1) !important;
    outline: none !important;
  }
  .slide-up {
    animation: slide-up 0.6s ease-out;
  }
  .fade-in {
    animation: fade-in 0.4s ease-out;
  }
`;

if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default function ManagerDashboard() {
  const quickActions = [
    {
      icon: Plus,
      title: "Assign New Task",
      description: "Create and assign tasks to team members",
    },
    {
      icon: Users,
      title: "View Employees",
      description: "Manage and view your team members",
    },
    {
      icon: TrendingUp,
      title: "Check Performance",
      description: "Review team performance metrics",
    },
    {
      icon: Briefcase,
      title: "Open HRM",
      description: "Access HR-related information",
    },
  ];

  const activities = [
    { icon: CheckCircle, text: "Task assigned to John Smith", time: "2 hours ago" },
    { icon: CheckCircle, text: "Priya completed a task", time: "4 hours ago" },
    { icon: FileText, text: "Performance report generated", time: "1 day ago" },
    { icon: AlertCircle, text: "HR request submitted", time: "2 days ago" },
  ];

  const pendingTasks = [
    { name: "Website Redesign", assignedTo: "John Smith", status: "In Progress" },
    { name: "Database Migration", assignedTo: "Priya Sharma", status: "Pending" },
    { name: "Mobile App Update", assignedTo: "Alex Brown", status: "In Progress" },
    { name: "API Documentation", assignedTo: "Mike Davis", status: "Review" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-purple-950/40 text-purple-200 border border-purple-500/30";
      case "Pending":
        return "bg-orange-950/40 text-orange-200 border border-orange-500/30";
      case "Review":
        return "bg-pink-950/40 text-pink-200 border border-pink-500/30";
      case "Completed":
        return "bg-green-950/40 text-green-200 border border-green-500/30";
      default:
        return "bg-slate-800/40 text-purple-200 border border-purple-500/30";
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(168, 85, 247, 0.15) 25%, rgba(168, 85, 247, 0.15) 26%, transparent 27%, transparent 74%, rgba(168, 85, 247, 0.15) 75%, rgba(168, 85, 247, 0.15) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(168, 85, 247, 0.15) 25%, rgba(168, 85, 247, 0.15) 26%, transparent 27%, transparent 74%, rgba(168, 85, 247, 0.15) 75%, rgba(168, 85, 247, 0.15) 76%, transparent 77%, transparent)`,
          backgroundSize: "80px 80px",
          zIndex: 0,
        }}
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
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

      {/* Main Content */}
      <div className="relative z-10 space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="slide-up">
        <h1 className="text-4xl font-bold text-white">Manager Dashboard</h1>
        <p className="text-purple-200/70 mt-2">Overview of your team</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 slide-up">
        {/* Total Employees Card */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="space-y-2">
            <p className="text-sm text-purple-200/70">Total Employees</p>
            <h2 className="text-3xl font-bold text-white">24</h2>
            <p className="text-xs text-purple-200/70">Team members</p>
          </div>
        </div>

        {/* Active Tasks Card */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="space-y-2">
            <p className="text-sm text-purple-200/70">Active Tasks</p>
            <h2 className="text-3xl font-bold text-white">18</h2>
            <p className="text-xs text-purple-200/70">In progress</p>
          </div>
        </div>

        {/* Performance Score Card */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="space-y-2">
            <p className="text-sm text-purple-200/70">Performance Score</p>
            <h2 className="text-3xl font-bold text-white">92%</h2>
            <p className="text-xs text-purple-200/70">Team average</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index} className="glass-card p-5 rounded-2xl slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-pink-500/20">
                    <Icon className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{action.title}</h3>
                    <p className="text-sm text-purple-200/70 mt-1">{action.description}</p>
                  </div>
                  <button className="neon-btn w-full px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-500/30 text-pink-200 hover:text-white text-sm font-medium">
                    Open
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Pending Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Team Activity */}
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Team Activity</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-purple-500/20 last:border-0">
                  <div className="flex-shrink-0 mt-1">
                    <Icon className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-purple-100">{activity.text}</p>
                    <p className="text-xs text-purple-200/70 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Tasks Overview */}
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Pending Tasks Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-3 px-2 font-medium text-purple-200/70">Task Name</th>
                  <th className="text-left py-3 px-2 font-medium text-purple-200/70">Assigned To</th>
                  <th className="text-left py-3 px-2 font-medium text-purple-200/70">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingTasks.map((task, index) => (
                  <tr key={index} className="border-b border-purple-500/10 last:border-0 hover:bg-purple-500/10 transition-colors">
                    <td className="py-3 px-2 text-purple-100">{task.name}</td>
                    <td className="py-3 px-2 text-purple-200">{task.assignedTo}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
