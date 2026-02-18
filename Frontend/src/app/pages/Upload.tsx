import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { StatusBadge } from "../components/StatusBadge";
import { Upload as UploadIcon, File, Check, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "../locales";
import { useAuth } from "../contexts/AuthContext";
import { carsService } from "../api/services/cars.service";
import { documentsService } from "../api/services/documents.service";
import { CarData, JobResponse } from "../api/types";

interface UploadedItem {
  id: string;
  uploadType: "receipt" | "issue_photo";
  fileName: string;
  jobId: string | null;
  jobStatus: JobResponse["status"] | "uploading";
  extractedData: Record<string, unknown> | null;
  error: string | null;
}

const POLL_INTERVAL_MS = 2500;

export function Upload() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();

  const [cars, setCars] = useState<CarData[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState<UploadedItem[]>([]);
  const pollingRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  // Load cars
  useEffect(() => {
    if (!isAuthenticated) return;
    carsService.getAllCars().then((data: CarData[]) => {
      setCars(data);
      if (data.length > 0) setSelectedCarId(data[0].id);
    }).catch(() => {
      toast.error("שגיאה בטעינת רכבים");
    });
  }, [isAuthenticated]);

  // Cleanup polling on unmount
  useEffect(() => {
    const refs = pollingRefs.current;
    return () => Object.values(refs).forEach(clearInterval);
  }, []);

  // Start polling a job until it reaches terminal state
  const startPolling = (localId: string, jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const job = await documentsService.getJob(jobId);
        setItems((prev) =>
          prev.map((item) =>
            item.id === localId
              ? { ...item, jobStatus: job.status, extractedData: job.output, error: job.error }
              : item,
          ),
        );

        if (job.status === "done" || job.status === "failed") {
          clearInterval(pollingRefs.current[localId]);
          delete pollingRefs.current[localId];

          if (job.status === "done") {
            toast.success("הקובץ עובד בהצלחה");
          } else {
            toast.error(`עיבוד נכשל: ${job.error || "שגיאה לא ידועה"}`);
          }
        }
      } catch {
        // Ignore transient polling errors
      }
    }, POLL_INTERVAL_MS);

    pollingRefs.current[localId] = interval;
  };

  const uploadFile = async (file: File, type: "receipt" | "issue_photo") => {
    if (!selectedCarId) {
      toast.error("בחר רכב לפני העלאת קובץ");
      return;
    }

    const localId = `${Date.now()}-${Math.random()}`;
    const newItem: UploadedItem = {
      id: localId,
      uploadType: type,
      fileName: file.name,
      jobId: null,
      jobStatus: "uploading",
      extractedData: null,
      error: null,
    };

    setItems((prev) => [newItem, ...prev]);

    try {
      const result = await documentsService.upload(file, selectedCarId, type);
      setItems((prev) =>
        prev.map((item) =>
          item.id === localId
            ? { ...item, jobId: result.jobId, jobStatus: "pending" }
            : item,
        ),
      );
      startPolling(localId, result.jobId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "שגיאה בהעלאה";
      setItems((prev) =>
        prev.map((item) =>
          item.id === localId
            ? { ...item, jobStatus: "failed", error: message }
            : item,
        ),
      );
      toast.error(message);
    }
  };

  const handleFiles = (fileList: FileList | null, type: "receipt" | "issue_photo") => {
    if (!fileList) return;
    Array.from(fileList).forEach((file) => uploadFile(file, type));
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent, type: "receipt" | "issue_photo") => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files, type);
  };

  const removeItem = (id: string) => {
    if (pollingRefs.current[id]) {
      clearInterval(pollingRefs.current[id]);
      delete pollingRefs.current[id];
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const DropZone = ({
    type,
    acceptAttr,
    title,
    subtitle,
    formatsNote,
  }: {
    type: "receipt" | "issue_photo";
    acceptAttr: string;
    title: string;
    subtitle: string;
    formatsNote: string;
  }) => (
    <Card>
      <CardContent className="p-4 md:p-8">
        {/* Car selector */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm font-medium shrink-0">רכב:</span>
          <Select value={selectedCarId} onValueChange={setSelectedCarId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="בחר רכב..." />
            </SelectTrigger>
            <SelectContent>
              {cars.map((car) => (
                <SelectItem key={car.id} value={car.id}>
                  {car.nickname || `${car.manufacturer} ${car.model}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, type)}
          className={`border-2 border-dashed rounded-lg p-6 md:p-12 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <UploadIcon className="w-10 h-10 md:w-12 md:h-12 mx-auto text-muted-foreground mb-3 md:mb-4" />
          <h3 className="font-semibold mb-2 text-sm md:text-base">{title}</h3>
          <p className="text-muted-foreground mb-4 text-xs md:text-sm">{subtitle}</p>
          <input
            type="file"
            multiple
            onChange={(e) => handleFiles(e.target.files, type)}
            className="hidden"
            id={`upload-${type}`}
            accept={acceptAttr}
          />
          <label htmlFor={`upload-${type}`}>
            <Button asChild>
              <span>{t.upload.dropzone.selectFiles}</span>
            </Button>
          </label>
          <p className="text-xs text-muted-foreground mt-4">{formatsNote}</p>
        </div>
      </CardContent>
    </Card>
  );

  const itemsForType = (type: "receipt" | "issue_photo") =>
    items.filter((item) => item.uploadType === type);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-right">{t.upload.title}</h1>
        <p className="text-muted-foreground mt-1 text-right text-sm md:text-base">{t.upload.subtitle}</p>
      </div>

      <Tabs defaultValue="receipts" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4 md:mb-0">
          <TabsTrigger value="receipts" className="text-xs md:text-sm">{t.upload.tabs.receipts}</TabsTrigger>
          <TabsTrigger value="issues" className="text-xs md:text-sm">{t.upload.tabs.issues}</TabsTrigger>
        </TabsList>

        <TabsContent value="receipts" className="space-y-4 mt-6">
          <DropZone
            type="receipt"
            acceptAttr=".pdf,.jpg,.jpeg,.png"
            title={t.upload.dropzone.dragHere}
            subtitle={t.upload.dropzone.orClick}
            formatsNote={t.upload.dropzone.supportedFormats}
          />
          {itemsForType("receipt").map((item) => (
            <UploadCard key={item.id} item={item} onRemove={removeItem} />
          ))}
        </TabsContent>

        <TabsContent value="issues" className="space-y-4 mt-6">
          <DropZone
            type="issue_photo"
            acceptAttr=".jpg,.jpeg,.png"
            title={t.upload.issues.title}
            subtitle={t.upload.issues.subtitle}
            formatsNote={t.upload.dropzone.supportedFormatsImages}
          />
          {itemsForType("issue_photo").map((item) => (
            <UploadCard key={item.id} item={item} onRemove={removeItem} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Upload card (shows status + extracted fields) ─────────────────────────────

interface UploadCardProps {
  item: UploadedItem;
  onRemove: (id: string) => void;
}

function UploadCard({ item, onRemove }: UploadCardProps) {
  const isLoading = item.jobStatus === "uploading" || item.jobStatus === "pending" || item.jobStatus === "running";
  const extracted = item.extractedData as Record<string, string | number> | null;

  const fieldLabels: Record<string, string> = {
    date: "תאריך",
    amount: "סכום",
    vendor: "ספק",
    category: "קטגוריה",
    odometerKm: "ק״מ",
    description: "תיאור",
    title: "כותרת",
    severity: "חומרה",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(item.id)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
            {item.jobStatus === "done" && <Check className="w-4 h-4 text-green-500 shrink-0" />}
            {item.jobStatus === "failed" && <AlertCircle className="w-4 h-4 text-destructive shrink-0" />}
            <StatusBadge type="status" value={item.jobStatus === "uploading" ? "running" : item.jobStatus} />
          </div>
          <div className="flex items-center gap-2 text-right">
            <span className="text-xs text-muted-foreground truncate max-w-[220px]">{item.fileName}</span>
            <File className="w-4 h-4 text-primary shrink-0" />
          </div>
        </div>
      </CardHeader>

      {isLoading && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground text-right">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            <span>
              {item.jobStatus === "uploading" ? "מעלה קובץ..." : "מעבד עם AI..."}
            </span>
          </div>
        </CardContent>
      )}

      {item.jobStatus === "failed" && item.error && (
        <CardContent className="pt-0">
          <p className="text-sm text-destructive text-right">{item.error}</p>
        </CardContent>
      )}

      {item.jobStatus === "done" && extracted && (
        <CardContent className="pt-0 space-y-2">
          <h4 className="font-semibold text-right text-sm">שדות שחולצו</h4>
          {Object.entries(extracted)
            .filter(([key, val]) => val !== null && val !== undefined && !["confidence", "rawText", "suspectedCauses", "selfChecks"].includes(key))
            .map(([key, val]) => (
              <div key={key} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                <span className="font-medium text-xs w-24 text-right shrink-0">
                  {fieldLabels[key] || key}
                </span>
                <Input
                  value={String(val)}
                  readOnly
                  className="flex-1 text-right text-sm h-8"
                />
              </div>
            ))}
        </CardContent>
      )}
    </Card>
  );
}
