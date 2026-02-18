import { Badge } from "./ui/badge";

type Severity = "low" | "medium" | "high";
type Status = "pending" | "running" | "done" | "failed";

interface StatusBadgeProps {
  type: "severity" | "status";
  value: Severity | Status;
}

const severityConfig = {
  low: { label: "נמוכה", className: "bg-green-100 text-green-800 border-green-200" },
  medium: { label: "בינונית", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  high: { label: "גבוהה", className: "bg-red-100 text-red-800 border-red-200" },
};

const statusConfig = {
  pending: { label: "ממתין", className: "bg-gray-100 text-gray-800 border-gray-200" },
  running: { label: "פועל", className: "bg-blue-100 text-blue-800 border-blue-200" },
  done: { label: "הושלם", className: "bg-green-100 text-green-800 border-green-200" },
  failed: { label: "נכשל", className: "bg-red-100 text-red-800 border-red-200" },
};

export function StatusBadge({ type, value }: StatusBadgeProps) {
  const config = type === "severity" 
    ? severityConfig[value as Severity]
    : statusConfig[value as Status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
