import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useTranslations } from "../locales";
import { Logo } from "../components/Logo";

export function Login() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("etamar234@gmail.com");
  const [name, setName] = useState("איתמר בן ארי");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("נא להזין כתובת דוא״ל");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, name || undefined);

      // Redirect to garage after successful login
      navigate("/garage");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "שגיאה בהתחברות";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div>
            <CardTitle className="text-2xl">{t.auth.login}</CardTitle>
            <CardDescription className="mt-2">
              {t.auth.loginDescription}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">
                {t.auth.email}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
                required
                className="text-right"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-right block">
                {t.auth.name}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.auth.namePlaceholder}
                className="text-right"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isSubmitting}
              size="lg"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? t.common.loading : t.auth.loginButton}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              המערכת תיצור משתמש חדש אוטומטית אם הדוא״ל לא קיים
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}