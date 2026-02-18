import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  currency?: boolean;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, currency }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
          {Icon && (
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-end gap-2">
          {currency && <span className="text-muted-foreground">₪</span>}
          <span className="text-3xl font-semibold">{value}</span>
        </div>
        {trend && (
          <div
            className={`flex items-center justify-end gap-1 mt-2 text-sm ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{trend.value}</span>
          </div>
        )}
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2 text-right">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
