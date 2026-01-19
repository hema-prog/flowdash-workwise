import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";

const styles = `
  @keyframes float-particle {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
    25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
    50% { transform: translateY(-40px) translateX(0); opacity: 0.3; }
    75% { transform: translateY(-20px) translateX(-10px); opacity: 0.6; }
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.6)); }
    50% { opacity: 0.8; filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.9)); }
  }
  @keyframes line-shimmer {
    0%, 100% { background-position: 0% 0%; filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.4)); }
    50% { background-position: 0% 100%; filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.6)); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes card-glow {
    0%, 100% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(59, 130, 246, 0.2); }
    50% { box-shadow: 0 0 50px rgba(168, 85, 247, 0.5), 0 0 80px rgba(59, 130, 246, 0.3); }
  }
  @keyframes btn-glow {
    0%, 100% { filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.4)); }
    50% { filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.8)); }
  }

  .particle {
    animation: float-particle linear infinite;
  }
  .glow-line {
    animation: line-shimmer 4s ease-in-out infinite;
  }
  .card-container {
    animation: slide-up 0.8s ease-out;
  }
  .glow-card {
    animation: card-glow 3s ease-in-out infinite;
  }
  .btn-glow:hover {
    animation: btn-glow 0.6s ease-in-out infinite;
  }
  .neon-focus:focus {
    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.3), 0 0 20px rgba(168, 85, 247, 0.6), inset 0 0 10px rgba(168, 85, 247, 0.1) !important;
    outline: none !important;
  }
`;

if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, setLoginTime } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Normalize role from backend (ADMIN, MANAGER, etc. -> admin, manager, etc.)
      const normalizedRole = data.role.toLowerCase();

      // Store JWT and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", normalizedRole);
      localStorage.setItem("userEmail", data.email);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.email}!`,
      });

      const loginTime = new Date();

      setUser({
      id: data.userId,
      email: data.email,
      role: normalizedRole as "admin" | "manager" | "project_manager" | "operator" | "hr",
    });
    setLoginTime(loginTime);

    

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // const roleCards = [
  //   // Operator: Use deep blue for icon when not selected
  //   { role: "operator" as const, title: "Operator", icon: Users, iconColor: COLOR_ACCENT_ICON  },
  //   // Manager: Use red for icon when not selected (as an accent)
  //   { role: "manager" as const, title: "Project Manager", icon: BarChart3, iconColor: COLOR_ACCENT_ICON },
  // ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden flex items-center justify-center p-4">
      {/* Grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(168, 85, 247, 0.15) 25%, rgba(168, 85, 247, 0.15) 26%, transparent 27%, transparent 74%, rgba(168, 85, 247, 0.15) 75%, rgba(168, 85, 247, 0.15) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(168, 85, 247, 0.15) 25%, rgba(168, 85, 247, 0.15) 26%, transparent 27%, transparent 74%, rgba(168, 85, 247, 0.15) 75%, rgba(168, 85, 247, 0.15) 76%, transparent 77%, transparent)`,
          backgroundSize: "80px 80px",
          zIndex: 1,
        }}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(25)].map((_, i) => (
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

      {/* Glow vertical line - Top center, suspending card */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-80 z-5 glow-line pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(168, 85, 247, 0.9), rgba(168, 85, 247, 0.7), rgba(59, 130, 246, 0.5), transparent)`,
          backgroundSize: "100% 200%",
          filter: "drop-shadow(0 0 15px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))",
          boxShadow: "0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(59, 130, 246, 0.3)",
        }}
      />

      {/* Glow connection point at top */}
      <div className="fixed top-12 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full z-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.9), transparent)",
          boxShadow: "0 0 20px rgba(168, 85, 247, 0.9), 0 0 40px rgba(59, 130, 246, 0.6)",
        }}
      />

      {/* Main content */}
      <div className="card-container w-full max-w-md relative z-10">
        {/* Card background glow */}
        <div
          className="absolute -inset-px rounded-2xl blur-2xl opacity-40 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.2))`,
          }}
        />

        {/* Login Card */}
        <Card 
          className="relative backdrop-blur-xl border border-purple-500/30 bg-slate-900/60 rounded-3xl shadow-2xl glow-card overflow-hidden"
        >
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15), transparent 70%)`,
            }}
          />

          <CardHeader className="text-center space-y-4 relative pt-8 pb-6">
            {/* Logo */}
            <div className="fade-in mb-2">
              <img 
                className="w-[10rem] mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300 brightness-95"
                src="https://i0.wp.com/dotspeaks.com/wp-content/uploads/2025/07/Dotspeaks-logo.png?fit=2560%2C591&ssl=1" 
                alt="Dotspeaks"
              />
            </div>

            {/* Title */}
            <CardTitle className="text-4xl font-bold text-white">
              Welcome Back
            </CardTitle>

            {/* Subtitle */}
            <p className="text-purple-200/70 text-sm font-light">
              Sign in to access your dashboard
            </p>

            {/* Accent line */}
            <div className="h-1 w-12 mx-auto rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.8), transparent)`,
              }}
            />
          </CardHeader>

          <CardContent className="relative space-y-5 pb-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label className="text-purple-200 font-medium text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="neon-focus bg-slate-800/40 border-purple-500/30 text-white placeholder:text-gray-500 rounded-xl h-11 transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-purple-200 font-medium text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="neon-focus bg-slate-800/40 border-purple-500/30 text-white placeholder:text-gray-500 rounded-xl h-11 transition-all duration-300"
                />
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className="w-full h-11 gap-2 text-base font-semibold rounded-xl btn-glow transition-all duration-300 mt-6"
                style={{
                  background: `linear-gradient(135deg, #ec4899, #a855f7, #7e18d8)`,
                  color: "white",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>

              {/* Divider line */}
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mt-6" />
            </form>

            {/* Footer */}
            <p className="text-center text-purple-300/50 text-xs font-light">
              Secure authentication • Protected data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}