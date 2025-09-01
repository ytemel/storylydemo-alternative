import { cn } from "@/lib/utils";
import { storylyStyles } from "@/lib/storyly-design-system";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { MetricData } from "@/lib/types";

interface MetricCardProps {
  data: MetricData;
  className?: string;
}

export default function MetricCard({ data, className }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-gray-500';
    }
  };

  const getIconBackgroundColor = () => {
    const colorMap: Record<string, string> = {
      'purple': 'bg-primary-light',
      'blue': 'bg-blue-100',
      'green': 'bg-green-100', 
      'yellow': 'bg-yellow-100',
      'red': 'bg-red-100',
      'primary': 'bg-primary-light',
    };
    return colorMap[data.color] || 'bg-gray-100';
  };

  const getIconColor = () => {
    const colorMap: Record<string, string> = {
      'purple': 'text-primary',
      'blue': 'text-blue-600',
      'green': 'text-success',
      'yellow': 'text-warning',
      'red': 'text-error',
      'primary': 'text-primary',
    };
    return colorMap[data.color] || 'text-gray-600';
  };

  return (
    <div className={cn(storylyStyles.card(), className)}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          getIconBackgroundColor()
        )}>
          <div 
            className={cn("w-5 h-5", getIconColor())}
            dangerouslySetInnerHTML={{ __html: data.icon }} 
          />
        </div>
        {data.change && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={cn("text-sm font-medium", getTrendColor())}>
              {data.change}
            </span>
          </div>
        )}
      </div>
      
      <div className={cn(storylyStyles.heading(2), "mb-1")}>
        {data.value}
      </div>
      
      <div className={storylyStyles.captionText()}>
        {data.label}
      </div>
    </div>
  );
}
