import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for combining classes

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "success" | "warning" | "destructive";
  
  // These props allow overrides from the parent component (OperatorDashboard)
  iconClassName?: string;
  valueClassName?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "primary",
  
  iconClassName,
  valueClassName,
}: StatsCardProps) => {
  const colorClasses = {
    primary: "bg-indigo-600/40 text-indigo-300",
    success: "bg-emerald-600/40 text-emerald-300",
    warning: "bg-amber-600/40 text-amber-300",
    destructive: "bg-red-600/40 text-red-300",
  };
  
  // Icon container with glassmorphism
  const iconContainerClass = `p-2 sm:p-3 ${colorClasses[color]} backdrop-blur rounded-lg border border-indigo-500/20`;

  // Responsive icon sizing
  const defaultIconClass = "h-5 w-5 sm:h-6 sm:w-6"; 

  // Responsive value sizing
  const defaultValueClass = "text-2xl sm:text-3xl"; 

  return (
    <div className="p-4 sm:p-6 h-full rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/40 transition-all hover:scale-105 duration-300 flex flex-col justify-between group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title styling */}
          <p className="text-xs sm:text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{title}</p>
          
          {/* Value styling */}
          <p className={cn("mt-2 font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent", defaultValueClass, valueClassName)}>{value}</p>
          
          {trend && (
            <p
              className={`mt-1 text-xs transition-colors ${
                trendUp ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        
        {/* Icon container with glassmorphism */}
        <div className={`rounded-xl ${iconContainerClass}`}>
          <Icon className={cn(defaultIconClass, iconClassName)} />
        </div>
      </div>
    </div>
  );
};