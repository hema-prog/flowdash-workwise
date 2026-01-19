import OperatorLayout from "./pages/Operator/OperatorLayout";
import OperatorHome from "./pages/Operator/OperatorHome";
import NotAuthorized from "./pages/NotAuthorized";
import AdminUsers from "./pages/Admin/AdminUsers";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, canAccessRoute } from "./pages/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import OperatorDashboard from "./pages/OperatorPerformanceDashboard";
import NotFound from "./pages/NotFound";
import EmployeeTaskTimeline from "./pages/Timeline";
import HrmDashboard from "./pages/hrmDashboard";
import { AuthProvider } from "./pages/AuthContext";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCreateUser from "./pages/Admin/AdminCreateUser";
import AdminLayout from "./pages/Admin/AdminLayout";
import Timesheet from "./pages/Operator/Timesheet";
import OperatorTasks from "./pages/Operator/OperatorTasks";
import OperatorDocuments from "./pages/Operator/OperatorDocuments";
import DashboardRedirect from "./pages/DashboardRedirect";
import ManagerLayout from "./pages/Manager/ManagerLayout";
import ManagerDashboard from "./pages/Manager/Dashboard";
import Employees from "./pages/Manager/Employees";
import Performance from "./pages/Manager/Performance";
import Reports from "./pages/Manager/Reports";
import ManagerHRM from "./pages/Manager/HRM";


const queryClient = new QueryClient();
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
console.log("🧠 ProtectedRoute check:", {
    role: user?.role,
    path: location.pathname,
  });
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessRoute(user.role, location.pathname)) {
    console.log("❌ ACCESS DENIED");
  return <Navigate to="/not-authorized" replace />;

}
 console.log("✅ ACCESS GRANTED");
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardRedirect />
    </ProtectedRoute>
  }
/>
            <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="create-user" element={<AdminCreateUser />} />
</Route>

            <Route
              path="/manager"
              element={
                <ProtectedRoute>
                  <ManagerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ManagerDashboard />} />
              <Route path="employees" element={<Employees />} />
              <Route path="performance" element={<Performance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="hrm" element={<ManagerHRM />} />
            </Route>

            <Route
              path="/operator"
              element={
                <ProtectedRoute>
                  <OperatorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OperatorHome />} />
              <Route path="performance" element={<OperatorDashboard />} />
              <Route path="tasks" element={<OperatorTasks />} />
              <Route path="documents" element={<OperatorDocuments />} />
              <Route path="timesheet" element={<Timesheet />} />
            </Route>

            <Route path="/timesheet" element={<EmployeeTaskTimeline />} />
            <Route path="/operator/hrm" element={<HrmDashboard />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
