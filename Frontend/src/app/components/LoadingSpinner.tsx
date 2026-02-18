export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-muted border-t-primary rounded-full animate-spin`}
      />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">טוען...</p>
      </div>
    </div>
  );
}
