import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";

/**
 * Car-Ops Agent - מערכת AI לניהול רכב
 *
 * A modern SaaS web application in Hebrew (RTL) for car maintenance management.
 *
 * Features:
 * - Dashboard with expense tracking and insights
 * - Garage management for multiple vehicles
 * - Document upload with AI extraction
 * - Timeline of maintenance events
 * - AI mechanic chat with structured responses
 * - Observability for agent runs
 * - Settings and security management
 *
 * Design:
 * - Clean, professional, trustworthy UI
 * - Deep blue automotive color scheme
 * - Fully RTL Hebrew layout
 * - Responsive desktop-first design
 */
export default function App() {
  return (
    <AuthProvider>
      <div dir="rtl" className="min-h-screen">
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </div>
    </AuthProvider>
  );
}