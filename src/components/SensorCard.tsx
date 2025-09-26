import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  colorClass: string;
  trend?: "up" | "down" | "stable";
  description?: string;
}

const SensorCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  colorClass, 
  trend = "stable",
  description 
}: SensorCardProps) => {
  const getTrendIndicator = () => {
    switch (trend) {
      case "up":
        return "↗ Naik";
      case "down":
        return "↘ Turun";
      default:
        return "→ Stabil";
    }
  };

  return (
    <Card className="gradient-card shadow-medium border-0 hover:shadow-strong transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={`text-3xl font-bold ${colorClass.replace('bg-', 'text-')}`}>
            {value}
          </div>
          <div className="text-lg text-muted-foreground">
            {unit}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">
            {description || "Real-time monitoring"}
          </p>
          <span className="text-xs font-medium text-muted-foreground">
            {getTrendIndicator()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;