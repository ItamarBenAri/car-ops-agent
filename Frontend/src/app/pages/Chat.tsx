import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { StatusBadge } from "../components/StatusBadge";
import { Send, User, Bot, ExternalLink, AlertCircle } from "lucide-react";
import { useTranslations } from "../locales";

type ChatMode = "quick" | "investigate" | "plan";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: ChatMode;
  structured?: {
    title: string;
    urgency: "low" | "medium" | "high";
    selfChecks: string[];
    askMechanic: string[];
    sources: Array<{ title: string; link: string }>;
    confidence: number;
    uncertainties: string[];
  };
}

export function Chat() {
  const t = useTranslations();
  const [mode, setMode] = useState<ChatMode>("quick");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "שמעתי רעש מוזר בבלמים כשאני בולם. מה זה יכול להיות?",
    },
    {
      id: "2",
      role: "assistant",
      content: "",
      mode: "quick",
      structured: {
        title: "רעש בבלמים בעת בלימה",
        urgency: "medium",
        selfChecks: [
          "בדוק אם הרעש מתרחש רק בבלימה חזקה או גם בבלימה רגילה",
          "האם הרעש מגיע מגלגל ספציפי או מכל הגלגלים?",
          "בדוק את עובי רפידות הבלמים דרך חישוקי הגלגלים (צריך להיות לפחות 3-4 מ״מ)",
          "האם מרגישים רעידות בדוושת הבלם בזמן הבלימה?",
        ],
        askMechanic: [
          "מה עובי רפידות הבלמים הקדמיות והאחוריות?",
          "האם יש חריצים או פגמים בדיסקים?",
          "האם יש סימנים לבלאי לא אחיד ברפידות?",
          "האם מערכת הבלמים זקוקה לדימום?",
        ],
        sources: [
          { title: "קבלה מוסך אלון - 28.01.2026", link: "#" },
          { title: "היסטוריה: תיקון בלמים קודם", link: "#" },
        ],
        confidence: 75,
        uncertainties: [
          "לא ברור אם הרעש נגרם מרפידות בלמים בלויות או מדיסקים מפוספסים",
          "ייתכן גם שיש זיהום על הרפידות (שמן, חלודה) שגורם לרעש",
        ],
      },
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      role: "user",
      content: input,
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: String(messages.length + 2),
        role: "assistant",
        content: "מעבד את השאלה שלך...",
        mode,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 500);
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      {/* Header with mode selector */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-right mb-3 md:mb-4">{t.chat.title}</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <Button
            variant={mode === "plan" ? "default" : "outline"}
            onClick={() => setMode("plan")}
            size="sm"
            className="relative w-full sm:w-auto"
          >
            {t.chat.modes.plan}
            {mode === "plan" && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-foreground rounded-full" />
            )}
          </Button>
          <Button
            variant={mode === "investigate" ? "default" : "outline"}
            onClick={() => setMode("investigate")}
            size="sm"
            className="relative w-full sm:w-auto"
          >
            {t.chat.modes.investigate}
            {mode === "investigate" && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-foreground rounded-full" />
            )}
          </Button>
          <Button
            variant={mode === "quick" ? "default" : "outline"}
            onClick={() => setMode("quick")}
            size="sm"
            className="relative w-full sm:w-auto"
          >
            {t.chat.modes.quick}
            {mode === "quick" && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-foreground rounded-full" />
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto space-y-4 md:space-y-6 mb-4 md:mb-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
            )}

            <div className={`max-w-3xl ${message.role === "user" ? "order-first" : ""}`}>
              {message.role === "user" ? (
                <div className="bg-primary text-primary-foreground rounded-lg p-4">
                  <p className="text-right">{message.content}</p>
                </div>
              ) : message.structured ? (
                <Card className="shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <StatusBadge type="severity" value={message.structured.urgency} />
                      <CardTitle className="text-right">{message.structured.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Self checks */}
                    <div>
                      <h4 className="font-semibold mb-3 text-right">{t.chat.response.selfChecks}</h4>
                      <ul className="space-y-2">
                        {message.structured.selfChecks.map((check, idx) => (
                          <li
                            key={idx}
                            className="flex gap-3 items-start text-right bg-secondary/50 p-3 rounded-lg"
                          >
                            <span className="text-primary shrink-0">✓</span>
                            <span className="flex-1">{check}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ask mechanic */}
                    <div>
                      <h4 className="font-semibold mb-3 text-right">{t.chat.response.questionsForGarage}</h4>
                      <ul className="space-y-2">
                        {message.structured.askMechanic.map((question, idx) => (
                          <li
                            key={idx}
                            className="flex gap-3 items-start text-right bg-accent/50 p-3 rounded-lg"
                          >
                            <span className="text-primary shrink-0">?</span>
                            <span className="flex-1">{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sources */}
                    <div>
                      <h4 className="font-semibold mb-3 text-right">{t.chat.response.sources}</h4>
                      <div className="space-y-2">
                        {message.structured.sources.map((source, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="w-full justify-between"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{source.title}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Confidence and uncertainties */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${message.structured.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {message.structured.confidence}%
                          </span>
                        </div>
                        <span className="font-medium text-sm">{t.chat.response.confidence}</span>
                      </div>

                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                          <h4 className="font-semibold text-yellow-900 text-sm">{t.chat.response.uncertainty}</h4>
                        </div>
                        <ul className="space-y-1 mr-6">
                          {message.structured.uncertainties.map((uncertainty, idx) => (
                            <li key={idx} className="text-sm text-yellow-800 text-right">
                              • {uncertainty}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-right">{message.content}</p>
                </div>
              )}
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button onClick={handleSend} className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.inputPlaceholder}
              className="min-h-[60px] resize-none text-right"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {t.chat.inputHint}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}