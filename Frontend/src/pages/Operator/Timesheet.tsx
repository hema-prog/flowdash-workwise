import { Clock, CalendarDays, FileText } from "lucide-react";
import { motion } from "framer-motion";

const weeklyData = [
  { day: "Mon", date: "13 Jan", hours: 9 },
  { day: "Tue", date: "14 Jan", hours: 8 },
  { day: "Wed", date: "15 Jan", hours: 9 },
  { day: "Thu", date: "16 Jan", hours: 6 },
  { day: "Fri", date: "17 Jan", hours: 5.5 },
  { day: "Sat", date: "18 Jan", hours: 0 },
  { day: "Sun", date: "19 Jan", hours: 0 },
];
const totalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);
const activeDays = weeklyData.filter(d => d.hours > 0).length;
const avgHours = activeDays ? totalHours / activeDays : 0;
let workloadStatus: "Balanced" | "Overworked" | "Underutilized" = "Balanced";

if (avgHours > 9.5) workloadStatus = "Overworked";
else if (avgHours < 7) workloadStatus = "Underutilized";

let assistantMessage = "";
let assistantType: "info" | "warning" | "success" = "info";

if (totalHours === 0) {
  assistantMessage =
    "You haven’t logged any time this week. Start tracking to avoid missing entries.";
  assistantType = "warning";
} else if (avgHours < 7) {
  assistantMessage =
    "Your average hours are a bit low. Review workload or update missing logs.";
  assistantType = "info";
} else if (avgHours > 9.5) {
  assistantMessage =
    "You’re working long hours consistently. Consider balancing workload.";
  assistantType = "warning";
} else {
  assistantMessage =
    "Great job! Your timesheet looks consistent and well-balanced this week.";
  assistantType = "success";
}

const getDayColor = (hours: number) => {
  if (hours >= 9) return "bg-green-950/40 border-green-500/30 text-green-300";
  if (hours > 0) return "bg-orange-950/40 border-orange-500/30 text-orange-300";
  return "bg-slate-800/40 border-purple-500/20 text-purple-200";
};

const styles = `
  @keyframes card-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.2); }
    50% { box-shadow: 0 0 35px rgba(168, 85, 247, 0.35); }
  }
  
  .glass-card {
    animation: card-glow 3s ease-in-out infinite;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(168, 85, 247, 0.2);
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 27, 75, 0.5));
  }
  
  .neon-btn {
    background: linear-gradient(135deg, rgb(147, 51, 234), rgb(236, 72, 153));
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
  }
  
  .neon-btn:hover {
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
  }
`;

if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default function Timesheet() {
  return (
    <div className="space-y-8">
        {/* FLOATING TIMESHEET ASSISTANT */}
<motion.div
  initial={{ opacity: 0, y: -20, scale: 0.95 }}
  animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  className="fixed top-10 right-6 z-50 w-[320px] p-4 rounded-xl border shadow-lg flex items-start gap-3 glass-card bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/30 text-green-300"
>

  <div className="text-xl">🧠</div>

  <p className="text-sm font-medium leading-snug">
    {assistantMessage}
  </p>
  
</motion.div>

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Timesheet</h1>
        <p className="text-purple-200/70">
          Track and review your working hours
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-sm text-purple-200/70">Today</p>
          <p className="text-2xl font-bold text-white">5.5 hrs</p>
          <Clock className="text-purple-400 mt-2" />
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <p className="text-sm text-purple-200/70">This Week</p>
          <p className="text-2xl font-bold text-white">32 hrs</p>
          <CalendarDays className="text-green-400 mt-2" />
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <p className="text-sm text-purple-200/70">Pending Submission</p>
          <p className="text-2xl font-bold text-white">1</p>
          <FileText className="text-pink-400 mt-2" />
        </div>
      </div>

      {/* WEEKLY TIMESHEET */}
<div className="glass-card p-6 rounded-2xl space-y-6">
  <h2 className="font-semibold text-white">Weekly Timesheet</h2>

  <div className="grid grid-cols-7 gap-3 text-center">
    {weeklyData.map((day) => (
      <motion.div
  key={day.day}
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.10 }}
  whileHover={{ scale: 1.05 }}
  className={`border rounded-xl p-4 cursor-pointer backdrop-filter backdrop-blur-sm transition-all ${getDayColor(day.hours)}`}
>

        <p className="font-semibold text-white">{day.day}</p>
        <p className="text-xs text-purple-200/70">{day.date}</p>

        <p className="text-2xl font-bold mt-2 text-white">
          {day.hours}
          <span className="text-sm font-medium text-purple-200/70">h</span>
        </p>

        <p className="text-xs mt-1 text-purple-200/70">
          {day.hours >= 9
            ? "Full Day"
            : day.hours > 0
            ? "Partial"
            : "No Work"}
        </p>
      </motion.div>
    ))}
  </div>

  {/* LEGEND */}
  <div className="flex gap-6 text-xs mt-4">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 bg-green-500/60 border border-green-400 rounded" />
      <span className="text-purple-200">Full Day (9h)</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 bg-orange-500/60 border border-orange-400 rounded" />
      <span className="text-purple-200">Partial Day</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 bg-slate-600/60 border border-purple-400 rounded" />
      <span className="text-purple-200">No Work</span>
    </div>
  </div>
</div>
{/* WORKLOAD BALANCE INDICATOR */}
<div className="glass-card p-5 rounded-2xl flex items-center justify-between">
  <div>
    <p className="text-sm text-purple-200/70">Workload Balance</p>
    <p
      className={`text-lg font-semibold ${
        workloadStatus === "Balanced"
          ? "text-green-300"
          : workloadStatus === "Overworked"
          ? "text-red-300"
          : "text-orange-300"
      }`}
    >
      {workloadStatus}
    </p>
    <p className="text-xs text-purple-200/70">
      Avg {avgHours.toFixed(1)} hrs/day
    </p>
  </div>

  <div className="text-3xl">
    {workloadStatus === "Balanced" && "⚖️"}
    {workloadStatus === "Overworked" && "🔥"}
    {workloadStatus === "Underutilized" && "💤"}
  </div>
</div>




      {/* ACTIONS */}
<div className="flex justify-between items-center">
  <p className="text-sm text-purple-200/70">
    Week Total: <strong className="text-white">37.5 hours</strong>
  </p>

  <div className="flex gap-3">
    <button className="border border-purple-500/30 text-purple-200 px-5 py-2 rounded-lg hover:bg-purple-500/20 transition-all">
      Export PDF
    </button>

    <button className="neon-btn text-white px-6 py-2 rounded-lg">
      Submit for Approval
    </button>
  </div>
</div>
    </div>
  );
}
