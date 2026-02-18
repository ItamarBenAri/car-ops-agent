import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { MessageSquare, ExternalLink, Calendar, Gauge, DollarSign, Building2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "../locales";
import { useAuth } from "../contexts/AuthContext";
import { timelineService } from "../api/services/timeline.service";
import { carsService } from "../api/services/cars.service";
import { TimelineEventResponse, CarData } from "../api/types";
import { LoadingSpinner, EmptyState } from "../components";

export function Timeline() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();

  // State
  const [events, setEvents] = useState<TimelineEventResponse[]>([]);
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filterCar, setFilterCar] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Fetch cars for filter dropdown
  useEffect(() => {
    const fetchCars = async () => {
      if (!isAuthenticated) return;

      try {
        const carsData = await carsService.getAllCars();
        setCars(carsData);
      } catch (err) {
        console.error("Error fetching cars for filter:", err);
      }
    };

    fetchCars();
  }, [isAuthenticated]);

  // Fetch timeline events when filters change
  useEffect(() => {
    const fetchTimeline = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = {
          carId: filterCar !== "all" ? filterCar : undefined,
          fromDate: dateFrom || undefined,
          toDate: dateTo || undefined,
          category: filterCategory !== "all" ? filterCategory : undefined,
          type: filterType !== "all" ? (filterType as "receipt" | "issue" | "maintenance") : undefined,
        };

        const data = await timelineService.getTimeline(params);
        setEvents(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t.errors.fetchTimeline;
        setError(errorMessage);
        toast.error(t.errors.fetchTimeline);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [isAuthenticated, filterCar, filterCategory, filterType, dateFrom, dateTo, t.errors.fetchTimeline]);

  const getEventIcon = (type: TimelineEventResponse["type"]) => {
    switch (type) {
      case "receipt":
        return <DollarSign className="w-5 h-5 text-primary" />;
      case "issue":
        return <MessageSquare className="w-5 h-5 text-yellow-600" />;
      case "maintenance":
        return <Calendar className="w-5 h-5 text-green-600" />;
    }
  };

  const getEventColor = (type: TimelineEventResponse["type"]) => {
    switch (type) {
      case "receipt":
        return "border-r-primary";
      case "issue":
        return "border-r-yellow-500";
      case "maintenance":
        return "border-r-green-500";
    }
  };

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
        <h1 className="text-xl md:text-2xl font-semibold text-right">{t.timeline.title}</h1>
        <p className="text-muted-foreground mt-1 text-right text-sm md:text-base">
          {t.timeline.subtitle}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">{t.timeline.filters.car}</Label>
              <Select value={filterCar} onValueChange={setFilterCar}>
                <SelectTrigger>
                  <SelectValue placeholder={t.timeline.filters.selectCar} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.timeline.filters.allCars}</SelectItem>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.nickname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right block">{t.timeline.filters.fromDate}</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">{t.timeline.filters.toDate}</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">{t.timeline.filters.category}</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t.timeline.filters.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.timeline.filters.all}</SelectItem>
                  <SelectItem value="שמן ומסננים">שמן ומסננים</SelectItem>
                  <SelectItem value="בלמים">בלמים</SelectItem>
                  <SelectItem value="צמיגים">צמיגים</SelectItem>
                  <SelectItem value="בדיקות">בדיקות</SelectItem>
                  <SelectItem value="תחזוקה שוטפת">תחזוקה שוטפת</SelectItem>
                  <SelectItem value="תיקונים">תיקונים</SelectItem>
                  <SelectItem value="אבחון">אבחון</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right block">{t.timeline.filters.type}</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder={t.timeline.filters.selectType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.timeline.filters.all}</SelectItem>
                  <SelectItem value="receipt">{t.timeline.eventTypes.receipt}</SelectItem>
                  <SelectItem value="issue">{t.timeline.eventTypes.issue}</SelectItem>
                  <SelectItem value="maintenance">{t.timeline.eventTypes.maintenance}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {events.length === 0 && !error && (
        <EmptyState
          icon={Inbox}
          title="אין אירועים להצגה"
          description="נסה לשנות את המסננים או להוסיף רכב חדש עם היסטוריה"
        />
      )}

      {/* Timeline */}
      {events.length > 0 && (
        <div className="space-y-4">
          {events.map((event, index) => (
            <Card
              key={event.id}
              className={`hover:shadow-md transition-shadow border-r-4 ${getEventColor(event.type)}`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center">
                      {getEventIcon(event.type)}
                    </div>
                    {index < events.length - 1 && (
                      <div className="w-0.5 h-12 md:h-16 bg-border"></div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 md:space-y-4">
                    <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
                        <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                          <MessageSquare className="w-3 h-3" />
                          {t.timeline.actions.askInChat}
                        </Button>
                        {event.documentLink && (
                          <Button variant="ghost" size="sm" className="gap-2 w-full sm:w-auto">
                            <ExternalLink className="w-3 h-3" />
                            {t.timeline.actions.viewDocument}
                          </Button>
                        )}
                      </div>
                      <div className="text-right w-full md:w-auto">
                        <h3 className="font-semibold text-base md:text-lg">{event.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                          {new Date(event.date).toLocaleDateString("he-IL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-muted-foreground">{event.km}</span>
                        <Gauge className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-muted-foreground">{event.vendor}</span>
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-semibold text-primary">{event.amount}</span>
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-muted-foreground">{event.category}</span>
                        <span className="text-xs">🏷️</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}