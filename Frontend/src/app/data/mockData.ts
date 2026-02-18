// Mock data for the Car-Ops Agent application

export const mockCars = [
  {
    id: "1",
    manufacturer: "מאזדה",
    model: "3",
    year: "2019",
    engine: "2.0 בנזין",
    transmission: "אוטומט",
    nickname: "מאזדה 3 - שלי",
    driveStatus: "connected" as const,
    km: "85,240",
  },
  {
    id: "2",
    manufacturer: "טויוטה",
    model: "קורולה",
    year: "2021",
    engine: "1.8 היברידי",
    transmission: "CVT",
    nickname: "טויוטה קורולה - של דנה",
    driveStatus: "connected" as const,
    km: "42,180",
  },
];

export const mockExpenseData = [
  { category: "שמן ומסננים", amount: 850 },
  { category: "צמיגים", amount: 2400 },
  { category: "בלמים", amount: 1200 },
  { category: "תחזוקה שוטפת", amount: 650 },
  { category: "תיקונים", amount: 1800 },
];

export const mockOpenIssues = [
  {
    id: 1,
    title: "רעש בבלמים קדמיים",
    severity: "medium" as const,
    date: "2026-02-10",
    description: "צריך בדיקה במוסך - ייתכן בעיית רפידות",
  },
  {
    id: 2,
    title: "נורת מנוע דולקת",
    severity: "high" as const,
    date: "2026-02-15",
    description: "קוד P0420 - חיישן חמצן",
  },
  {
    id: 3,
    title: "החלפת שמן מתקרבת",
    severity: "low" as const,
    date: "2026-02-12",
    description: "נותרו 1,200 ק״מ",
  },
];

export const mockTimelineEvents = [
  {
    id: "1",
    title: "החלפת שמן ומסנן",
    date: "2026-02-15",
    km: "85,240",
    vendor: "מוסך אלון",
    amount: "₪450",
    category: "שמן ומסננים",
    type: "receipt" as const,
    documentLink: "#",
  },
  {
    id: "2",
    title: "תיקון בלמים קדמיים",
    date: "2026-01-28",
    km: "84,100",
    vendor: "מוסך אלון",
    amount: "₪1,200",
    category: "בלמים",
    type: "receipt" as const,
    documentLink: "#",
  },
  {
    id: "3",
    title: "נורת מנוע - חיישן חמצן",
    date: "2026-01-15",
    km: "83,500",
    vendor: "אבחון עצמאי",
    amount: "₪0",
    category: "אבחון",
    type: "issue" as const,
  },
  {
    id: "4",
    title: "החלפת צמיגים",
    date: "2025-12-10",
    km: "82,000",
    vendor: "צמיגי הנגב",
    amount: "₪2,400",
    category: "צמיגים",
    type: "receipt" as const,
    documentLink: "#",
  },
  {
    id: "5",
    title: "בדיקה תקופתית",
    date: "2025-11-20",
    km: "80,500",
    vendor: "מוסך מורשה טסט",
    amount: "₪95",
    category: "בדיקות",
    type: "maintenance" as const,
    documentLink: "#",
  },
];
