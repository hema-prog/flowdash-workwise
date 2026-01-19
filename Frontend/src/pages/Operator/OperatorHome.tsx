import { useState, useEffect } from "react";
import { Clock, AlertCircle, CheckCircle2, FileText, Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../AuthContext";

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

export default function OperatorHome() {
  const { user } = useAuth();
  const [focusMode, setFocusMode] = useState(false);
  const [focusedTask, setFocusedTask] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
const hoursWorkedToday = seconds / 3600;
const todayStatus =
  hoursWorkedToday >= 9
    ? "full"
    : hoursWorkedToday > 0
    ? "partial"
    : "none";

const completedTasks = 12;
const pendingTasks = 1;
let assistantMessage = "";
let assistantType: "info" | "warning" | "success" = "info";

if (!timerRunning) {
  assistantMessage = "You haven’t started tracking time today. Start the timer to stay productive.";
  assistantType = "info";
} else if (pendingTasks > 0) {
  assistantMessage = `You have ${pendingTasks} pending task(s) that need attention.`;
  assistantType = "warning";
} else if (focusMode) {
  assistantMessage = "Focus Mode is enabled. Distractions are minimized — stay focused!";
  assistantType = "success";
} else {
  assistantMessage = "Great job! You’re on track today.";
  assistantType = "success";
}

const totalTasks = completedTasks + pendingTasks;
const productivityScore =
  totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

useEffect(() => {
  let interval: any;

  if (timerRunning) {
    interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [timerRunning]);

  const startTimer = () => {
    setTimerRunning(true);

    toast({
      title: "Timer Started",
      description: "Tracking time for Homepage UI Development",
    });
  };

  const stopTimer = () => {
    setTimerRunning(false);
    setSeconds(0);

    toast({
      title: "Timer Stopped",
      description: "Time logged successfully",
    });
  };

  const startFocus = () => {
    if (!timerRunning) return;
    setFocusMode(true);
  };

  const stopFocus = () => {
    setFocusMode(false);
    setFocusedTask(null);
  };
  const mockCalendarData: Record<number, {
    hours: number;
    tasks: number;
  }> = {
    21: { hours: 9, tasks: 4 },
    22: { hours: 8.5, tasks: 3 },
    23: { hours: 9, tasks: 5 },
    24: { hours: 7, tasks: 2 },
    25: { hours: 9, tasks: 4 },
  };
const getDayStyle = (day: number) => {
    const data = mockCalendarData[day];

    if (!data) {
      return "bg-slate-800/40 border-purple-500/10";
    }

    if (data.hours >= 9) {
      return "bg-green-900/30 border-green-500/30";
    }

    if (data.hours > 0) {
      return "bg-orange-900/30 border-orange-500/30";
    }

    return "bg-slate-800/40 border-purple-500/10";
  };

  const userDisplay = user?.email?.split("@")[0] || "Operator";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
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
      <div className="relative z-10">
        {/* 🔵 FOCUS MODE BANNER */}
        {focusMode && (
          <div className="sticky top-0 z-50 glass-card mx-6 mt-6 mb-6 flex items-center justify-between">
            <p className="font-semibold text-white">
              🎯 Focus Mode ON — Working on{" "}
              <span className="underline text-pink-400">{focusedTask}</span>
            </p>
            <button
              onClick={stopFocus}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-lg font-semibold neon-btn"
            >
              <X size={16} /> Stop Focus
            </button>
          </div>
        )}

        {/* 🔽 DASHBOARD CONTENT */}
        <div
          className={`space-y-8 transition-all duration-300 px-6 py-8 ${
            focusMode ? "opacity-40 pointer-events-none blur-sm" : ""
          }`}
        >
          {/* HEADER */}
          <div className="slide-up">
            <h1 className="text-4xl font-bold text-white">My Dashboard</h1>
            <p className="text-purple-200/70">
              Operator: {userDisplay.charAt(0).toUpperCase() + userDisplay.slice(1)} • Today: 17/01/2026
            </p>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-5 gap-6 slide-up">
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-200/70">Today's Hours</p>
                  <p className="text-2xl font-bold text-white">5.5 / 9</p>
                  <p className="text-xs text-pink-400">3.5h remaining</p>
                </div>
                <Clock className="text-purple-400" size={24} />
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-200/70">Tasks Pending</p>
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-xs text-pink-400">1 in progress</p>
                </div>
                <AlertCircle className="text-orange-400" size={24} />
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-200/70">Tasks Completed</p>
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-xs text-green-400">This week</p>
                </div>
                <CheckCircle2 className="text-green-400" size={24} />
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-200/70">Documents</p>
                  <p className="text-2xl font-bold text-white">8</p>
                  <p className="text-xs text-pink-400">3 pending review</p>
                </div>
                <FileText className="text-blue-400" size={24} />
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-200/70">Productivity Score</p>
                  <p className="text-2xl font-bold text-white">{productivityScore}%</p>
                  <p
                    className={`text-xs font-medium ${
                      productivityScore >= 80
                        ? "text-green-400"
                        : productivityScore >= 50
                        ? "text-orange-400"
                        : "text-red-400"
                    }`}
                  >
                    {productivityScore >= 80
                      ? "Excellent"
                      : productivityScore >= 50
                      ? "Needs work"
                      : "Low"}
                  </p>
                </div>
                <CheckCircle2
                  className={
                    productivityScore >= 80
                      ? "text-green-400"
                      : productivityScore >= 50
                      ? "text-orange-400"
                      : "text-red-400"
                  }
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* TIME TRACKER + QUICK UPDATE */}
          <div className="grid grid-cols-2 gap-6 slide-up">
            {/* Time Tracker */}
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="font-semibold mb-4 flex items-center gap-2 text-white">
                <Clock size={18} className="text-purple-400" /> Time Tracker
              </h2>
              <select className="w-full bg-slate-800/60 border border-purple-500/30 text-white rounded-lg p-2 mb-6 neon-input focus:bg-slate-800/80">
                <option>Choose a task to track</option>
                <option>Homepage UI Development</option>
              </select>
              <div className="text-center">
                <p className="text-5xl font-mono mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {new Date(seconds * 1000).toISOString().substring(11, 19)}
                </p>
                {!timerRunning ? (
                  <button
                    onClick={startTimer}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg neon-btn"
                  >
                    ▶ Start Timer
                  </button>
                ) : (
                  <button
                    onClick={stopTimer}
                    className="bg-gradient-to-r from-pink-600 to-red-600 text-white px-6 py-2 rounded-lg neon-btn"
                  >
                    ⏹ Stop & Log Time
                  </button>
                )}

                {timerRunning && (
                  <button
                    onClick={startFocus}
                    className="mt-3 text-purple-300 text-sm font-medium underline hover:text-pink-300 transition-colors"
                  >
                    Enable Focus Mode
                  </button>
                )}
              </div>
            </div>

            {/* Quick Update */}
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="font-semibold mb-4 flex items-center gap-2 text-white">
                <FileText size={18} className="text-purple-400" /> Quick Update & Upload
              </h2>

              <div className="space-y-4">
                <select className="w-full bg-slate-800/60 border border-purple-500/30 text-white rounded-lg p-2 neon-input focus:bg-slate-800/80">
                  <option>Select task</option>
                </select>

                <select className="w-full bg-slate-800/60 border border-purple-500/30 text-white rounded-lg p-2 neon-input focus:bg-slate-800/80">
                  <option>Update status</option>
                </select>

                <textarea
                  className="w-full bg-slate-800/60 border border-purple-500/30 text-white rounded-lg p-2 neon-input focus:bg-slate-800/80 placeholder:text-purple-300/50"
                  placeholder="Add progress notes..."
                />

                <div className="flex items-center gap-2 border border-purple-500/30 bg-slate-800/60 rounded-lg p-2">
                  <input type="file" className="flex-1 text-white" />
                  <Upload size={16} className="text-purple-400" />
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg neon-btn font-medium">
                  Submit Update
                </button>
              </div>
            </div>
          </div>

          {/* WORK CALENDAR */}
          <div className="glass-card p-6 rounded-2xl slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-white">Work Calendar</h2>

              <div className="flex items-center gap-3">
                <button className="w-8 h-8 border border-purple-500/30 bg-slate-800/60 text-white rounded-lg flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                  ‹
                </button>

                <span className="text-purple-200/70 font-medium">
                  January 2026
                </span>

                <button className="w-8 h-8 border border-purple-500/30 bg-slate-800/60 text-white rounded-lg flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                  ›
                </button>
              </div>
            </div>

            {/* DAY NAMES */}
            <div className="grid grid-cols-7 text-sm text-purple-300 mb-3 px-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const data = mockCalendarData[day];

                return (
                  <div
                    key={day}
                    className={`h-28 border rounded-xl p-3 text-xs flex flex-col justify-between backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getDayStyle(day)}`}
                  >
                    <span className="font-semibold text-white">{day}</span>

                    {data && (
                      <div className="text-[10px] text-purple-200">
                        <p className="font-medium">{data.hours}h</p>
                        <p>{data.tasks} tasks</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <hr className="my-5 border-purple-500/20" />

            <div className="flex gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500/60 border border-green-400 rounded" />
                <span className="text-purple-200/70">9 Hours Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500/60 border border-orange-400 rounded" />
                <span className="text-purple-200/70">Partial Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-slate-600/60 border border-slate-500 rounded" />
                <span className="text-purple-200/70">No Data</span>
              </div>
            </div>
          </div>

          {/* ASSIGNED TASKS */}
          <div className="glass-card p-6 rounded-2xl space-y-4 slide-up">
            <h2 className="font-semibold text-white">My Assigned Tasks (3)</h2>

            <div className="border border-purple-500/30 rounded-lg p-4 bg-slate-800/40">
              <div className="flex justify-between mb-2">
                <p className="font-medium text-white">Homepage UI Development</p>
                <span className="text-sm text-purple-400">69%</span>
              </div>
              <div className="h-2 bg-slate-700/60 rounded">
                <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded w-[69%]" />
              </div>
            </div>
          </div>

          {/* SMART WORKDAY ASSISTANT */}
          <div
            className={`p-4 rounded-xl border backdrop-blur-md mb-6 flex items-center gap-3 slide-up ${
              assistantType === "info"
                ? "bg-blue-950/40 border-blue-500/30 text-blue-200"
                : assistantType === "warning"
                ? "bg-orange-950/40 border-orange-500/30 text-orange-200"
                : "bg-green-950/40 border-green-500/30 text-green-200"
            }`}
          >
            <AlertCircle size={18} />
            <p className="text-sm font-medium">
              {assistantMessage}
            </p>
          </div>

          {/* REMINDER */}
          <div className="glass-card border-orange-500/30 p-4 rounded-xl flex justify-between items-center slide-up">
            <p className="text-orange-300 font-medium">
              Pending Tasks Reminder – You have 1 task that needs attention
            </p>
            <button className="bg-slate-800/60 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-lg hover:bg-orange-500/20 transition-colors neon-btn">
              View Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
