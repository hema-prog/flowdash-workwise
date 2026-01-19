import { Card } from "@/components/ui/card";

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
`;

if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default function Performance() {
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
      <div className="border-b border-blue-500/20 pb-4 sm:pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ textShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}>
          Performance Overview
        </h1>
        <p className="text-blue-200/70 mt-2">Team performance summary and task insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Tasks Card */}
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-200/70">Total Tasks</p>
            <h2 className="text-4xl font-bold text-white">120</h2>
            <p className="text-xs text-blue-300/60">Overall assignments</p>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-200/70">Completed Tasks</p>
            <h2 className="text-4xl font-bold text-green-400">85</h2>
            <p className="text-xs text-blue-300/60">71% completion rate</p>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-200/70">Pending Tasks</p>
            <h2 className="text-4xl font-bold text-orange-400">35</h2>
            <p className="text-xs text-blue-300/60">Awaiting completion</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
