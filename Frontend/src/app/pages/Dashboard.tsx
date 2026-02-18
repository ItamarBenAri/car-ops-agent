import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/StatusBadge";
import { MessageSquare, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useTranslations } from "../locales";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../api/client";
import { timelineService } from "../api/services/timeline.service";
import { CarApiResponse, TimelineEventResponse } from "../api/types";
import { LoadingSpinner } from "../components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#1e3a5f", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export function Dashboard() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    openIssues: 0,
    totalCars: 0,
    totalKm: 0,
  });
  const [recentEvents, setRecentEvents] = useState<TimelineEventResponse[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<Array<{ category: string; amount: number }>>([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch all cars with stats directly from API
        const carsWithStats = await apiClient.get<CarApiResponse[]>('/cars');

        // Calculate total expenses and open issues across all cars
        const totalExpenses = carsWithStats.reduce((sum, car) => sum + (car.stats?.totalExpenses || 0), 0);
        const openIssues = carsWithStats.reduce((sum, car) => sum + (car.stats?.openIssues || 0), 0);
        const totalKm = carsWithStats.reduce((sum, car) => {
          const kmValue = parseInt(car.km.replace(/[^\d]/g, ''), 10);
          return sum + (isNaN(kmValue) ? 0 : kmValue);
        }, 0);

        setStats({
          totalExpenses,
          openIssues,
          totalCars: carsWithStats.length,
          totalKm,
        });

        // Fetch timeline events to get expense breakdown by category
        const timeline = await timelineService.getTimeline({});

        // Get recent events (last 5)
        setRecentEvents(timeline.slice(0, 5));

        // Calculate expenses by category
        const categoryMap = new Map<string, number>();
        timeline.filter(event => event.type === 'receipt').forEach(event => {
          const amount = parseFloat(event.amount.replace(/[^\d.]/g, ''));
          if (!isNaN(amount)) {
            const current = categoryMap.get(event.category) || 0;
            categoryMap.set(event.category, current + amount);
          }
        });

        const categoryExpenses = Array.from(categoryMap.entries())
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        setExpensesByCategory(categoryExpenses);

      } catch (err) {
        toast.error(t.errors.fetchDashboard || 'שגיאה בטעינת נתוני לוח הבקרה');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, t.errors.fetchDashboard]);

  // Calculate cost per km
  const costPerKm = stats.totalKm > 0 ? (stats.totalExpenses / stats.totalKm).toFixed(2) : '0.00';

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">{t.dashboard.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">{t.dashboard.subtitle}</p>
      </div>

      {/* Main CTA - Next Action (keeping static for MVP) */}
      <Card className="border-primary/20 bg-accent/30">
        <CardHeader>
          <CardTitle className="text-right text-base md:text-lg">{t.dashboard.nextAction.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex-1 text-right w-full">
              <h3 className="font-semibold text-base md:text-lg">{t.dashboard.nextAction.inspection}</h3>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                {t.dashboard.nextAction.inspectionDetails}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                {t.dashboard.nextAction.recommendation}
              </p>
            </div>
            <StatusBadge type="severity" value="medium" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/chat" className="w-full sm:w-auto">
              <Button className="gap-2 w-full sm:w-auto">
                <ChevronLeft className="w-4 h-4" />
                {t.dashboard.nextAction.askMechanic}
                <MessageSquare className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto">{t.dashboard.nextAction.findGarages}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">{t.dashboard.stats.yearlyExpenses}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-muted-foreground">₪</span>
              <span className="text-3xl font-semibold">{stats.totalExpenses.toLocaleString('he-IL')}</span>
            </div>
            <div className="flex items-center justify-end gap-1 mt-2 text-sm text-muted-foreground">
              <span>סה״כ הוצאות</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">תקלות פתוחות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-3xl font-semibold">{stats.openIssues}</span>
            </div>
            <div className="flex items-center justify-end gap-1 mt-2 text-sm text-muted-foreground">
              <span>דורשות טיפול</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">{t.dashboard.stats.costPerKm}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-muted-foreground">₪</span>
              <span className="text-3xl font-semibold">{costPerKm}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-right">
              {t.dashboard.stats.basedOnKm} {stats.totalKm.toLocaleString('he-IL')} ק״מ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced toggle */}
      {expensesByCategory.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
          >
            {showAdvanced ? t.dashboard.advanced.hide : t.dashboard.advanced.show}
          </Button>
        </div>
      )}

      {/* Advanced section */}
      {showAdvanced && expensesByCategory.length > 0 && (
        <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-top-4">
          {/* Expense breakdown chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-base">{t.dashboard.advanced.expenseBreakdown}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={300}>
                  <BarChart data={expensesByCategory} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={100} className="text-xs md:text-sm" />
                    <Tooltip />
                    <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                      {expensesByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent events (if any issues found) */}
          {stats.openIssues > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">אירועים אחרונים</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentEvents.filter(e => e.type === 'issue').slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="p-3 md:p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="text-right">
                        <h3 className="font-semibold text-sm md:text-base">{event.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">{event.vendor}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString("he-IL")}
                        </p>
                      </div>
                      <div>
                        <Link to="/chat" className="inline-block">
                          <Button variant="outline" size="sm" className="gap-2">
                            <MessageSquare className="w-3 h-3" />
                            {t.dashboard.advanced.askInChat}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}