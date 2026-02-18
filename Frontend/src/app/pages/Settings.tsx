import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { User, Crown, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "../locales";

interface UserPermission {
  id: string;
  name: string;
  email: string;
  role: "owner" | "partner";
}

interface Secret {
  id: string;
  name: string;
  masked: string;
}

export function Settings() {
  const t = useTranslations();
  const [users, setUsers] = useState<UserPermission[]>([
    { id: "1", name: "יוסי כהן", email: "yossi@example.com", role: "owner" },
    { id: "2", name: "דנה כהן", email: "dana@example.com", role: "partner" },
  ]);

  const [secrets, setSecrets] = useState<Secret[]>([
    { id: "1", name: "OPENAI_API_KEY", masked: "sk-...abc123" },
    { id: "2", name: "GOOGLE_DRIVE_TOKEN", masked: "ya29...xyz789" },
  ]);

  const [toolPermissions, setToolPermissions] = useState({
    webSearch: true,
    emailNotifications: true,
    autoReminders: false,
    dataExport: true,
  });

  const [safetyPolicies, setSafetyPolicies] = useState({
    requireConfirmation: true,
    restrictWebSearch: false,
    enableAutoReminders: true,
  });

  const [showSecret, setShowSecret] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-right">{t.settings.title}</h1>
        <p className="text-muted-foreground mt-1 text-right text-sm md:text-base">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Users section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">{t.settings.users.title}</CardTitle>
          <CardDescription className="text-right">
            {t.settings.users.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {user.role === "owner" ? (
                  <Button variant="ghost" size="sm" disabled>
                    <Crown className="w-4 h-4 text-yellow-600" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {user.role === "owner" && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        {t.settings.users.roles.owner}
                      </span>
                    )}
                    {user.role === "partner" && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {t.settings.users.roles.partner}
                      </span>
                    )}
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            {t.settings.users.addUser}
          </Button>
        </CardContent>
      </Card>

      {/* Tool permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">{t.settings.tools.title}</CardTitle>
          <CardDescription className="text-right">
            {t.settings.tools.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Switch
              checked={toolPermissions.webSearch}
              onCheckedChange={(checked) =>
                setToolPermissions({ ...toolPermissions, webSearch: checked })
              }
            />
            <div className="flex-1 text-right mr-4">
              <Label>{t.settings.tools.webSearch.title}</Label>
              <p className="text-sm text-muted-foreground">
                {t.settings.tools.webSearch.description}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Switch
              checked={toolPermissions.emailNotifications}
              onCheckedChange={(checked) =>
                setToolPermissions({ ...toolPermissions, emailNotifications: checked })
              }
            />
            <div className="flex-1 text-right mr-4">
              <Label>{t.settings.tools.emailNotifications.title}</Label>
              <p className="text-sm text-muted-foreground">
                {t.settings.tools.emailNotifications.description}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Switch
              checked={toolPermissions.autoReminders}
              onCheckedChange={(checked) =>
                setToolPermissions({ ...toolPermissions, autoReminders: checked })
              }
            />
            <div className="flex-1 text-right mr-4">
              <Label>{t.settings.tools.autoReminders.title}</Label>
              <p className="text-sm text-muted-foreground">
                {t.settings.tools.autoReminders.description}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Switch
              checked={toolPermissions.dataExport}
              onCheckedChange={(checked) =>
                setToolPermissions({ ...toolPermissions, dataExport: checked })
              }
            />
            <div className="flex-1 text-right mr-4">
              <Label>{t.settings.tools.dataExport.title}</Label>
              <p className="text-sm text-muted-foreground">
                {t.settings.tools.dataExport.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secrets management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">{t.settings.secrets.title}</CardTitle>
          <CardDescription className="text-right">
            {t.settings.secrets.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {secrets.map((secret) => (
            <div
              key={secret.id}
              className="flex items-center gap-3 p-4 border border-border rounded-lg"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSecret(showSecret === secret.id ? null : secret.id)}
              >
                {showSecret === secret.id ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <div className="flex-1 text-right space-y-1">
                <Label>{secret.name}</Label>
                <Input
                  type={showSecret === secret.id ? "text" : "password"}
                  value={secret.masked}
                  readOnly
                  className="font-mono text-sm"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            {t.settings.secrets.addSecret}
          </Button>
        </CardContent>
      </Card>

      {/* Safety policies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">{t.settings.safety.title}</CardTitle>
          <CardDescription className="text-right">
            {t.settings.safety.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Switch
              checked={safetyPolicies.requireConfirmation}
              onCheckedChange={(checked) =>
                setSafetyPolicies({ ...safetyPolicies, requireConfirmation: checked })
              }
            />
            <div className="flex-1 text-right mr-4">
              <Label>{t.settings.safety.requireConfirmation.title}</Label>
              <p className="text-sm text-muted-foreground">
                {t.settings.safety.requireConfirmation.description}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Switch
              checked={safetyPolicies.restrictWebSearch}
              onCheckedChange={(checked) =>
                setSafetyPolicies({ ...safetyPolicies, restrictWebSearch: checked })
              }
            />
            <div className="flex-1 text-right mr-4">
              <Label>{t.settings.safety.restrictWebSearch.title}</Label>
              <p className="text-sm text-muted-foreground">
                {t.settings.safety.restrictWebSearch.description}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Switch
              checked={safetyPolicies.enableAutoReminders}
              onCheckedChange={(checked) =>
                setSafetyPolicies({ ...safetyPolicies, enableAutoReminders: checked })
              }
            />
            <div className="flex-1 text-right mr-4">
              <Label>{t.settings.safety.enableAutoReminders.title}</Label>
              <p className="text-sm text-muted-foreground">
                {t.settings.safety.enableAutoReminders.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive text-right">{t.settings.danger.title}</CardTitle>
          <CardDescription className="text-right">
            {t.settings.danger.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full text-destructive border-destructive/50">
            {t.settings.danger.deleteHistory}
          </Button>
          <Button variant="outline" className="w-full text-destructive border-destructive/50">
            {t.settings.danger.disconnectDrive}
          </Button>
          <Button variant="destructive" className="w-full">
            {t.settings.danger.deleteAccount}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
