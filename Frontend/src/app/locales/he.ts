/**
 * Hebrew (עברית) translations for Car-Ops Agent
 * Organized by page/component for easy maintenance
 */

export const he = {
  // Common/Shared
  common: {
    loading: "טוען...",
    error: "שגיאה",
    save: "שמור",
    cancel: "ביטול",
    edit: "ערוך",
    delete: "מחק",
    confirm: "אשר",
    back: "חזור",
    close: "סגור",
    search: "חיפוש",
    filter: "סינון",
    all: "הכל",
    select: "בחר",
    selectFile: "בחר קבצים",
    viewDetails: "פרטים",
    status: "סטטוס",
    date: "תאריך",
    amount: "סכום",
  },

  // Error Messages
  errors: {
    network: "בעיית תקשורת - בדוק את החיבור לשרת",
    serverError: "שגיאה בשרת - נסה שוב מאוחר יותר",
    unauthorized: "נדרשת הזדהות מחדש",
    fetchCars: "שגיאה בטעינת רכבים",
    fetchTimeline: "שגיאה בטעינת ציר הזמן",
    createCar: "שגיאה בהוספת רכב",
    updateCar: "שגיאה בעדכון רכב",
    deleteCar: "שגיאה במחיקת רכב",
    fetchDashboard: "שגיאה בטעינת נתוני לוח הבקרה",
  },

  // Success Messages
  success: {
    carCreated: "הרכב נוסף בהצלחה",
    carUpdated: "הרכב עודכן בהצלחה",
    carDeleted: "הרכב נמחק בהצלחה",
    loginSuccess: "התחברת בהצלחה",
    dataSaved: "הנתונים נשמרו בהצלחה",
  },

  // Authentication
  auth: {
    login: "התחברות",
    logout: "התנתק",
    email: "דוא״ל",
    name: "שם מלא",
    loginButton: "התחבר למערכת",
    loginDescription: "הזן את הדוא״ל שלך להתחברות (ללא סיסמה)",
    emailPlaceholder: "your@email.com",
    namePlaceholder: "שם מלא (אופציונלי)",
  },

  // Navigation
  nav: {
    dashboard: "לוח בקרה",
    garage: "ניהול רכבים",
    upload: "העלאת מסמכים",
    timeline: "ציר זמן",
    chat: "צ'אט המכונאי",
    observability: "מתקדם",
    settings: "הגדרות ואבטחה",
  },

  // Upload Page
  upload: {
    title: "העלאת מסמכים",
    subtitle: "העלה קבלות ותקלות לעיבוד אוטומטי",
    tabs: {
      receipts: "קבלות",
      issues: "תקלות / נורות",
    },
    dropzone: {
      dragHere: "גרור קבצים לכאן",
      orClick: "או לחץ לבחירת קבצים",
      selectFiles: "בחר קבצים",
      supportedFormats: "תומך ב-PDF, JPG, PNG עד 10MB",
      supportedFormatsImages: "תומך ב-JPG, PNG עד 10MB",
    },
    issues: {
      title: "העלה תמונות של נורות או תקלות",
      subtitle: "המערכת תזהה אוטומטית את סוג הבעיה ותציע פתרונות",
    },
    fileCard: {
      runProcessing: "הרץ עיבוד עכשיו",
      confirmSave: "אשר ושמור",
      extractedFields: "שדות שחולצו מהמסמך",
    },
    fields: {
      date: "תאריך",
      km: "ק״מ",
      amount: "סכום",
      vendor: "ספק",
      category: "קטגוריה",
    },
    categories: {
      maintenance: "תחזוקה שוטפת",
      repair: "תיקון",
      oilChange: "החלפת שמן",
      tires: "צמיגים",
      brakes: "בלמים",
      inspection: "טסט",
    },
  },

  // Dashboard Page
  dashboard: {
    title: "לוח בקרה",
    subtitle: "סקירה כללית של מצב הרכב והוצאות",
    nextAction: {
      title: "הדבר הבא שצריך לעשות",
      inspection: "בדיקה תקופתית מתקרבת",
      inspectionDetails: "הבדיקה התקופתית הבאה תפוג בעוד 12 ימים (28.02.2026)",
      recommendation: "מומלץ לתאם תור מראש במוסך מורשה",
      askMechanic: "שאל את המכונאי",
      findGarages: "מצא מוסכים באזור",
    },
    stats: {
      monthlyExpenses: "הוצאות חודש זה",
      yearlyExpenses: "הוצאות שנה זו",
      costPerKm: "עלות לק״מ",
      lessThanLastMonth: "פחות מחודש שעבר",
      moreThanLastYear: "יותר מאשתקד",
      basedOnKm: "מבוסס על",
    },
    advanced: {
      show: "הצג מידע מתקדם",
      hide: "הסתר מידע מתקדם",
      expenseBreakdown: "פירוט הוצאות לפי קטגוריה (12 חודשים אחרונים)",
      openIssues: "תקלות פתוחות",
      recurringIssues: "תקלות חוזרות",
      askInChat: "שאל בצ'אט",
      brakeIssues: "בעיות בבלמים",
      timesDetected: "זוהתה {count} פעמים ב-18 חודשים אחרונים",
      systemCheckRecommendation: "מומלץ לבדוק האם יש בעיה מערכתית שדורשת תשומת לב מיוחדת",
    },
  },

  // Garage Page
  garage: {
    title: "ניהול רכבים",
    subtitle: "כל הרכבים במערכת",
    addNew: "הוסף רכב חדש",
    addNewDialog: {
      title: "הוספת רכב חדש",
      manufacturer: "יצרן",
      manufacturerPlaceholder: "למשל: טויוטה, מאזדה, יונדאי",
      model: "דגם",
      modelPlaceholder: "למשל: קורולה, 3, i30",
      year: "שנה",
      yearPlaceholder: "2020",
      engine: "מנוע",
      enginePlaceholder: "למשל: 1.8 היברידי, 2.0 בנזין",
      transmission: "תיבת הילוכים",
      transmissionPlaceholder: "למשל: אוטומט, ידני, CVT",
      nickname: "כינוי לרכב",
      nicknamePlaceholder: "למשל: הרכב של אבא, המשפחתית",
      save: "שמור",
      cancel: "ביטול",
    },
    card: {
      engine: "מנוע",
      transmission: "תיבה",
      mileage: "קילומטראז׳",
      edit: "ערוך",
      history: "היסטוריה",
    },
    driveStatus: {
      connected: "מחובר ל-Google Drive",
      syncing: "מסנכרן...",
      disconnected: "לא מחובר",
    },
  },

  // Timeline Page
  timeline: {
    title: "ציר זמן",
    subtitle: "היסטוריה מלאה של כל האירועים והתחזוקות",
    filters: {
      car: "רכב",
      selectCar: "בחר רכב",
      allCars: "כל הרכבים",
      fromDate: "מתאריך",
      toDate: "עד תאריך",
      category: "קטגוריה",
      selectCategory: "בחר קטגוריה",
      allCategories: "כל הקטגוריות",
      all: "הכל",
      type: "סוג אירוע",
      selectType: "בחר סוג",
      allTypes: "כל הסוגים",
      receipts: "קבלות",
      maintenance: "טיפולים",
      issues: "תקלות",
    },
    eventTypes: {
      receipt: "קבלות",
      issue: "תקלות",
      maintenance: "תחזוקה",
    },
    actions: {
      askInChat: "שאל בצ'אט",
      viewDocument: "צפה במסמך",
    },
    eventCard: {
      km: "ק״מ",
      vendor: "ספק",
      amount: "סכום",
      category: "קטגוריה",
    },
  },

  // Chat Page
  chat: {
    title: "צ'אט המכונאי",
    modes: {
      plan: "Plan - תכנון ארוך טווח",
      investigate: "Investigate - חקירה מעמיקה",
      quick: "Quick - תשובה מהירה",
    },
    inputPlaceholder: "שאל שאלה על הרכב שלך...",
    inputHint: "לחץ Enter לשליחה, Shift+Enter לשורה חדשה",
    sendButton: "שלח",
    response: {
      summary: "סיכום הבעיה",
      urgency: "רמת דחיפות",
      selfChecks: "בדיקות עצמאיות שאתה יכול לעשות:",
      questionsForGarage: "שאלות לשאול את המכונאי:",
      sources: "מקורות:",
      confidence: "רמת ביטחון",
      uncertainty: "אי-ודאות:",
    },
  },

  // Observability Page
  observability: {
    title: "מתקדם - Observability",
    subtitle: "מעקב אחרי ריצות Agent וכלים",
    runsTable: {
      title: "היסטוריית ריצות Agent",
      id: "ID",
      dateTime: "תאריך ושעה",
      type: "סוג",
      status: "סטטוס",
      toolCalls: "קריאות כלים",
      duration: "זמן ריצה",
      actions: "פעולות",
      viewDetails: "פרטים",
    },
    runDetail: {
      backToList: "חזור לרשימה",
      timeline: "Timeline צעדים",
      toolCalls: "קריאות כלים",
      tool: "כלי",
      input: "קלט",
      output: "פלט",
      status: "סטטוס",
      duration: "משך זמן",
    },
    types: {
      receiptParsing: "עיבוד קבלה",
      issueAnalysis: "ניתוח תקלה",
      chatResponse: "תשובה בצ'אט",
      reminderCheck: "בדיקת תזכורות",
    },
  },

  // Settings Page
  settings: {
    title: "הגדרות ואבטחה",
    subtitle: "ניהול משתמשים, הרשאות ומדיניות אבטחה",
    users: {
      title: "משתמשים",
      subtitle: "ניהול גישה למערכת והרשאות משתמשים",
      addUser: "הוסף משתמש",
      name: "שם",
      email: "אימייל",
      role: "תפקיד",
      joined: "הצטרף",
      actions: "פעולות",
      edit: "ערוך",
      remove: "הסר",
      roles: {
        owner: "בעלים",
        partner: "שותף",
      },
    },
    tools: {
      title: "הרשאות כלים",
      subtitle: "בחר אילו כלים ה-Agent יכול להשתמש בהם",
      webSearch: {
        title: "חיפוש באינטרנט",
        description: "אפשר ל-Agent לחפש מידע באינטרנט",
      },
      emailNotifications: {
        title: "התראות במייל",
        description: "שלח התראות על תחזוקה ותקלות",
      },
      autoReminders: {
        title: "תזכורות אוטומטיות",
        description: "יצירת תזכורות אוטומטיות לתחזוקה",
      },
      dataExport: {
        title: "ייצוא נתונים",
        description: "אפשר ייצוא נתונים לקבצים חיצוניים",
      },
    },
    secrets: {
      title: "ניהול Secrets",
      subtitle: "מפתחות API וסודות למערכת",
      addSecret: "הוסף Secret",
      show: "הצג",
      hide: "הסתר",
    },
    safety: {
      title: "מדיניות אבטחה",
      subtitle: "הגדרות בטיחות והגנה על נתונים",
      requireConfirmation: {
        title: "דרוש אישור לפעולות רגישות",
        description: "דרוש אישור ידני לפני מחיקה או שינוי של נתונים",
      },
      restrictWebSearch: {
        title: "הגבל חיפוש באינטרנט",
        description: "אפשר חיפוש רק באתרים מאושרים מראש",
      },
      enableAutoReminders: {
        title: "הפעל תזכורות אוטומטיות",
        description: "שלח תזכורות על תחזוקה ובדיקות תקופתיות",
      },
    },
    danger: {
      title: "אזור סכנה",
      subtitle: "פעולות בלתי הפיכות - שימו לב!",
      deleteHistory: "מחק את כל ההיסטוריה",
      disconnectDrive: "נתק חשבון Google Drive",
      deleteAccount: "מחק חשבון לצמיתות",
    },
  },

  // Status values
  status: {
    pending: "ממתין",
    running: "מעבד",
    done: "הושלם",
    failed: "נכשל",
    success: "הצליח",
    error: "שגיאה",
  },

  // Severity levels
  severity: {
    low: "נמוכה",
    medium: "בינונית",
    high: "גבוהה",
    critical: "קריטית",
  },

  // User info (example)
  user: {
    name: "יוסי כהן",
    email: "yossi@example.com",
    profile: "פרופיל",
    logout: "התנתק",
  },

  // Cars (example data)
  cars: {
    car1: {
      name: "מאזדה 3 - שלי",
      year: "2019",
    },
    car2: {
      name: "טויוטה קורולה - של דנה",
      year: "2021",
    },
  },
};

export default he;
