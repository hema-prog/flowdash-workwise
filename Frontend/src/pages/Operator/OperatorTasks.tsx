import { CheckCircle2, AlertCircle, Clock, X } from "lucide-react";
import { useState } from "react";

const initialTasks = [

  {
    id: 1,
    title: "Homepage UI Development",
    status: "IN PROGRESS",
    priority: "High",
    due: "18 Jan 2026",
  },
  {
    id: 2,
    title: "API Integration",
    status: "TODO",
    priority: "Medium",
    due: "20 Jan 2026",
  },
  {
    id: 3,
    title: "Bug Fixing",
    status: "COMPLETED",
    priority: "Low",
    due: "15 Jan 2026",
  },
];

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

export default function OperatorTasks() {
      const [selectedTask, setSelectedTask] = useState<any | null>(null);
const [tasks, setTasks] = useState(initialTasks);
const updateTaskStatus = (newStatus: string) => {
  if (!selectedTask) return;

  setTasks((prev) =>
    prev.map((task) =>
      task.id === selectedTask.id
        ? { ...task, status: newStatus }
        : task
    )
  );

  if (newStatus === "COMPLETED") {
  setTimeout(() => setSelectedTask(null), 600);
} else {
  setSelectedTask((prev) =>
    prev ? { ...prev, status: newStatus } : prev
  );
}
};

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">My Tasks</h1>
        <p className="text-purple-200/70">
          Tasks assigned to you by the manager
        </p>
      </div>

      {/* TASK LIST */}
      <div className="glass-card rounded-2xl divide-y divide-purple-500/20 overflow-hidden">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="p-5 flex justify-between items-center cursor-pointer hover:bg-purple-500/10 transition-colors"
          >

            {/* LEFT */}
            <div className="space-y-1">
              <p className="font-semibold text-white">
                {task.title}
              </p>
              <p className="text-sm text-purple-200/70">
                Due: {task.due}
              </p>
            </div>

            {/* CENTER */}
            <div className="flex items-center gap-2">
              {task.status === "COMPLETED" && (
                <CheckCircle2 className="text-green-400" />
              )}
              {task.status === "IN PROGRESS" && (
                <Clock className="text-purple-400" />
              )}
              {task.status === "TODO" && (
                <AlertCircle className="text-orange-400" />
              )}
              <span className="text-sm font-medium text-purple-200">
                {task.status}
              </span>
            </div>

            {/* RIGHT */}
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                task.priority === "High"
                  ? "bg-red-950/40 text-red-300 border border-red-500/30"
                  : task.priority === "Medium"
                  ? "bg-orange-950/40 text-orange-300 border border-orange-500/30"
                  : "bg-green-950/40 text-green-300 border border-green-500/30"
              }`}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>
      {/* TASK DETAILS MODAL */}
{selectedTask && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="glass-card rounded-2xl shadow-xl w-full max-w-md p-6 relative">
      
      {/* CLOSE */}
      <button
        onClick={() => setSelectedTask(null)}
        className="absolute top-4 right-4 text-purple-300 hover:text-pink-400 transition-colors"
      >
        <X size={18} />
      </button>

      {/* HEADER */}
      <h2 className="text-xl font-bold text-white mb-2">
        {selectedTask.title}
      </h2>

      <p className="text-sm text-purple-200/70 mb-4">
        Due on {selectedTask.due}
      </p>

      {/* STATUS & PRIORITY */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedTask.status}
          onChange={(e) => updateTaskStatus(e.target.value)}
          className="px-3 py-2 text-sm bg-slate-800/60 border border-purple-500/30 text-white rounded-lg focus:border-purple-400"
        >
          <option value="TODO">TODO</option>
          <option value="IN PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>


        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            selectedTask.priority === "High"
              ? "bg-red-950/40 text-red-300 border border-red-500/30"
              : selectedTask.priority === "Medium"
              ? "bg-orange-950/40 text-orange-300 border border-orange-500/30"
              : "bg-green-950/40 text-green-300 border border-green-500/30"
          }`}
        >
          Priority: {selectedTask.priority}
        </span>
      </div>

      {/* DESCRIPTION */}
      <div className="text-sm text-purple-200 mb-6">
        <p className="font-medium mb-1">Task Description</p>
        <p>
          This task is assigned by the manager. Complete the work
          and update the status once finished.
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setSelectedTask(null)}
          className="px-4 py-2 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/20 transition-colors text-sm"
        >
          Close
        </button>

        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all">
          Mark as Done
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
