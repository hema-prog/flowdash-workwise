import { useState } from "react";
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FolderKanban,
  Users,
  Clock,
  CheckCircle2,
  Plus,
  TrendingUp,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function ManagerDashboard() {
  const [isCreateEmpOpen, setIsCreateEmpOpen] = useState(false);

  const employees = [
    {
      id: 1,
      name: "John Doe",
      role: "Senior Developer",
      status: "Active",
      tasksCompleted: 12,
      hoursLogged: 72,
      efficiency: 95,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      status: "Active",
      tasksCompleted: 15,
      hoursLogged: 81,
      efficiency: 98,
    },
    {
      id: 3,
      name: "Mike Davis",
      role: "Backend Developer",
      status: "On Leave",
      tasksCompleted: 8,
      hoursLogged: 54,
      efficiency: 87,
    },
    {
      id: 4,
      name: "Emily Chen",
      role: "Frontend Developer",
      status: "Active",
      tasksCompleted: 10,
      hoursLogged: 63,
      efficiency: 92,
    },
  ];

  const weeklyData = [
    { day: "Mon", hours: 68 },
    { day: "Tue", hours: 72 },
    { day: "Wed", hours: 69 },
    { day: "Thu", hours: 75 },
    { day: "Fri", hours: 71 },
  ];

  const performanceData = [
    { week: "Week 1", completion: 85 },
    { week: "Week 2", completion: 88 },
    { week: "Week 3", completion: 92 },
    { week: "Week 4", completion: 90 },
  ];

  const activeEmployees = employees.filter((e) => e.status === "Active").length;

  return (
    <Layout role="manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Manage team, track performance, and assign tasks
            </p>
          </div>
          <Dialog open={isCreateEmpOpen} onOpenChange={setIsCreateEmpOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Employee Name</Label>
                  <Input placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="employee@company.com" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="tester">QA Tester</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Create Employee</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Total Employees"
            value={employees.length}
            icon={Users}
            trend={`${activeEmployees} active`}
            trendUp={true}
            color="primary"
          />
          <StatsCard
            title="Active Projects"
            value="8"
            icon={FolderKanban}
            trend="+2 this month"
            trendUp={true}
            color="success"
          />
          <StatsCard
            title="Total Hours (Week)"
            value="355"
            icon={Clock}
            trend="89% of target"
            trendUp={true}
            color="warning"
          />
          <StatsCard
            title="Completion Rate"
            value="92%"
            icon={CheckCircle2}
            trend="+5% from last week"
            trendUp={true}
            color="success"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Weekly Hours Overview</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h3 className="text-lg font-semibold">Task Completion Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--success))", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Employee List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Team Overview</h3>
            <div className="flex items-center gap-2">
              <Input placeholder="Search employees..." className="w-64" />
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="p-4 rounded-lg border border-border hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                      {emp.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{emp.name}</h4>
                        <Badge variant={emp.status === "Active" ? "success" : "default" as any}>
                          {emp.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{emp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Tasks</div>
                      <div className="text-lg font-semibold">{emp.tasksCompleted}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Hours</div>
                      <div className="text-lg font-semibold">{emp.hoursLogged}h</div>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <div className="text-sm text-muted-foreground mb-1">Efficiency</div>
                      <Progress value={emp.efficiency} className="h-2" />
                      <div className="text-xs font-medium mt-1">{emp.efficiency}%</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Assign Task
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Generate Weekly Report</h4>
                <p className="text-sm text-muted-foreground">View team performance</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-3">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                <h4 className="font-semibold">Monthly Report</h4>
                <p className="text-sm text-muted-foreground">Comprehensive analytics</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-3">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h4 className="font-semibold">Pending Reviews</h4>
                <p className="text-sm text-muted-foreground">3 timesheets to review</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
