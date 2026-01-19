import { useState } from "react";
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

// Mock employee data
const MOCK_EMPLOYEES = [
  { id: 1, name: "John Smith", role: "Developer", email: "john@example.com" },
  { id: 2, name: "Sarah Johnson", role: "Designer", email: "sarah@example.com" },
  { id: 3, name: "Mike Davis", role: "Product Manager", email: "mike@example.com" },
  { id: 4, name: "Emma Wilson", role: "QA Engineer", email: "emma@example.com" },
  { id: 5, name: "Alex Brown", role: "Developer", email: "alex@example.com" },
];

export default function Employees() {
  const [selectedEmployee, setSelectedEmployee] = useState<typeof MOCK_EMPLOYEES[0] | null>(null);

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
          Employees
        </h1>
        <p className="text-blue-200/70 mt-2">Manage and view your team members</p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column - Employee List (30%) */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Employee List</h2>
            <div className="space-y-2">
              {MOCK_EMPLOYEES.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedEmployee?.id === employee.id
                      ? "bg-blue-500/30 border border-blue-400/50 text-white"
                      : "bg-blue-950/20 hover:bg-blue-900/30 border border-blue-500/20 text-blue-100 hover:text-white"
                  }`}
                >
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-blue-300/70">{employee.role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Employee Details (70%) */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Employee Details</h2>

            {selectedEmployee ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-blue-200/70">Name</p>
                  <p className="text-lg text-white">{selectedEmployee.name}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-200/70">Email</p>
                  <p className="text-lg text-blue-100">{selectedEmployee.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-200/70">Role</p>
                  <p className="text-lg text-white">{selectedEmployee.role}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-200/70">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-lg text-white">Active</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] text-center">
                <p className="text-blue-300/60">Select an employee to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
