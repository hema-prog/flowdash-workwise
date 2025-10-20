import { useState } from "react";
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { WorksheetCalendar } from "@/components/WorksheetCalendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Play,
  Pause,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OperatorDashboard() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const { toast } = useToast();

  const tasks = [
    {
      id: 1,
      name: "Homepage UI Development",
      project: "Website Redesign",
      status: "In Progress",
      hoursAllocated: 8,
      hoursUsed: 5.5,
      deadline: "2024-10-25",
      priority: "high",
    },
    {
      id: 2,
      name: "API Integration",
      project: "Mobile App",
      status: "Pending",
      hoursAllocated: 12,
      hoursUsed: 0,
      deadline: "2024-10-28",
      priority: "medium",
    },
    {
      id: 3,
      name: "Database Schema Design",
      project: "Database Migration",
      status: "Completed",
      hoursAllocated: 6,
      hoursUsed: 6,
      deadline: "2024-10-22",
      priority: "low",
    },
  ];

  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;

  const handleStartTimer = () => {
    if (!currentTask) {
      toast({
        title: "Select a task",
        description: "Please select a task before starting the timer",
        variant: "destructive",
      });
      return;
    }
    setIsTimerRunning(true);
    toast({
      title: "Timer Started",
      description: `Tracking time for: ${currentTask}`,
    });
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    toast({
      title: "Timer Stopped",
      description: "Time logged successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      "In Progress": "warning",
      Completed: "success",
      Pending: "default",
    };
    return variants[status] || "default";
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      high: "destructive",
      medium: "warning",
      low: "default",
    };
    return variants[priority] || "default";
  };

  return (
    <Layout role="operator">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-1">My Dashboard</h1>
          <p className="text-muted-foreground">
            Employee: John Doe • Today: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Today's Hours"
            value="5.5/9"
            icon={Clock}
            trend="3.5h remaining"
            trendUp={false}
            color="primary"
          />
          <StatsCard
            title="Tasks Pending"
            value={pendingTasks}
            icon={AlertCircle}
            trend={`${inProgressTasks} in progress`}
            trendUp={false}
            color="warning"
          />
          <StatsCard
            title="Tasks Completed"
            value="12"
            icon={CheckCircle2}
            trend="This week"
            trendUp={true}
            color="success"
          />
          <StatsCard
            title="Documents"
            value="8"
            icon={FileText}
            trend="3 pending review"
            trendUp={false}
            color="primary"
          />
        </div>

        {/* Timer & Quick Update */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Time Tracker */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Time Tracker</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Task</Label>
                <Select value={currentTask} onValueChange={setCurrentTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a task to track" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks
                      .filter((t) => t.status !== "Completed")
                      .map((task) => (
                        <SelectItem key={task.id} value={task.name}>
                          {task.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center py-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-4 font-mono tabular-nums">
                    {isTimerRunning ? "01:23:45" : "00:00:00"}
                  </div>
                  {isTimerRunning ? (
                    <Button
                      size="lg"
                      variant="destructive"
                      className="gap-2"
                      onClick={handleStopTimer}
                    >
                      <Pause className="h-4 w-4" />
                      Stop & Log Time
                    </Button>
                  ) : (
                    <Button size="lg" className="gap-2" onClick={handleStartTimer}>
                      <Play className="h-4 w-4" />
                      Start Timer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Status Update */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Quick Update & Upload</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Task</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id.toString()}>
                        {task.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea placeholder="Add progress notes..." rows={2} />
              </div>

              <div className="space-y-2">
                <Label>Upload Document/Report</Label>
                <div className="flex gap-2">
                  <Input type="file" className="flex-1" />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button className="w-full">Submit Update</Button>
            </div>
          </Card>
        </div>

        {/* Calendar */}
        <WorksheetCalendar />

        {/* My Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Assigned Tasks</h3>
            <Badge variant="outline">{tasks.length} Total</Badge>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => {
              const progress = (task.hoursUsed / task.hoursAllocated) * 100;
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border border-border hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{task.name}</h4>
                        <Badge variant={getStatusBadge(task.status) as any}>
                          {task.status}
                        </Badge>
                        <Badge variant={getPriorityBadge(task.priority) as any}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{task.project}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.hoursUsed}/{task.hoursAllocated}h
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {task.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Reminders */}
        {pendingTasks > 0 && (
          <Card className="p-4 bg-warning/10 border-warning">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div className="flex-1">
                <p className="font-medium text-warning">Pending Tasks Reminder</p>
                <p className="text-sm text-muted-foreground">
                  You have {pendingTasks} task(s) that need attention
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Tasks
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
