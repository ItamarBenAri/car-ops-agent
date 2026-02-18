import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Car, Plus, FolderOpen, CheckCircle2, AlertCircle, AlertTriangle, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "../locales";
import { useAuth } from "../contexts/AuthContext";
import { carsService } from "../api/services/cars.service";
import { CarData } from "../api/types";
import { LoadingSpinner, EmptyState } from "../components";

export function Garage() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();

  // State
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    manufacturer: "",
    model: "",
    year: "",
    engine: "",
    transmission: "",
    nickname: "",
  });

  // Fetch cars from API on mount
  useEffect(() => {
    const fetchCars = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await carsService.getAllCars();
        setCars(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t.errors.fetchCars;
        setError(errorMessage);
        toast.error(t.errors.fetchCars);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [isAuthenticated, t.errors.fetchCars]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Create car via API (convert year string → number)
      const newCar = await carsService.createCar({
        manufacturer: formData.manufacturer,
        model: formData.model,
        year: parseInt(formData.year, 10),
        engine: formData.engine || undefined,
        transmission: formData.transmission || undefined,
        nickname: formData.nickname || undefined,
        currentOdometerKm: 0,
      });

      // Add to local state
      setCars([...cars, newCar]);

      // Reset form and close dialog
      setFormData({
        manufacturer: "",
        model: "",
        year: "",
        engine: "",
        transmission: "",
        nickname: "",
      });
      setIsDialogOpen(false);

      // Show success toast
      toast.success(t.success.carCreated);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.errors.createCar;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDriveStatusIcon = (status: CarData["driveStatus"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "syncing":
        return <FolderOpen className="w-5 h-5 text-blue-600 animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDriveStatusText = (status: CarData["driveStatus"]) => {
    switch (status) {
      case "connected":
        return t.garage.driveStatus.connected;
      case "syncing":
        return t.garage.driveStatus.syncing;
      default:
        return t.garage.driveStatus.disconnected;
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

  // Error state
  if (error && !cars.length) {
    return (
      <div className="p-4 md:p-6">
        <EmptyState
          icon={AlertTriangle}
          title="שגיאה בטעינת רכבים"
          description={error}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Page header */}
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              {t.garage.addNew}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-right">{t.garage.addNewDialog.title}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="text-right block">{t.garage.addNewDialog.manufacturer}</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder={t.garage.addNewDialog.manufacturerPlaceholder}
                  required
                  className="text-right"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-right block">{t.garage.addNewDialog.model}</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder={t.garage.addNewDialog.modelPlaceholder}
                  required
                  className="text-right"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-right block">{t.garage.addNewDialog.year}</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder={t.garage.addNewDialog.yearPlaceholder}
                  required
                  className="text-right"
                  disabled={isSubmitting}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="engine" className="text-right block">{t.garage.addNewDialog.engine}</Label>
                <Input
                  id="engine"
                  value={formData.engine}
                  onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                  placeholder={t.garage.addNewDialog.enginePlaceholder}
                  className="text-right"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission" className="text-right block">{t.garage.addNewDialog.transmission}</Label>
                <Input
                  id="transmission"
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  placeholder={t.garage.addNewDialog.transmissionPlaceholder}
                  className="text-right"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-right block">{t.garage.addNewDialog.nickname}</Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder={t.garage.addNewDialog.nicknamePlaceholder}
                  className="text-right"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? t.common.loading : t.garage.addNewDialog.save}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  {t.garage.addNewDialog.cancel}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <div className="text-right w-full sm:w-auto">
          <h1 className="text-xl md:text-2xl font-semibold">{t.garage.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{t.garage.subtitle}</p>
        </div>
      </div>

      {/* Empty state */}
      {cars.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="אין רכבים במערכת"
          description="הוסף רכב חדש כדי להתחיל לנהל את תחזוקת הרכב שלך"
        />
      )}

      {/* Cars grid */}
      {cars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getDriveStatusIcon(car.driveStatus)}
                    <span className="text-xs text-muted-foreground">
                      {getDriveStatusText(car.driveStatus)}
                    </span>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>

                <h3 className="font-semibold text-base md:text-lg mb-1 text-right">{car.nickname}</h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-4 text-right">
                  {car.manufacturer} {car.model} • {car.year}
                </p>

                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{car.engine}</span>
                    <span className="font-medium">{t.garage.card.engine}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{car.transmission}</span>
                    <span className="font-medium">{t.garage.card.transmission}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{car.km}</span>
                    <span className="font-medium">{t.garage.card.mileage}</span>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    {t.garage.card.edit}
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    {t.garage.card.history}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}