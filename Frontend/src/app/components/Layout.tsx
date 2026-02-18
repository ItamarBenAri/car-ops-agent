import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Car,
  LayoutDashboard,
  Upload,
  Clock,
  MessageSquare,
  Activity,
  Settings,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Logo } from "./Logo";
import { useIsMobile } from "./ui/use-mobile";
import { useAuth } from "../contexts/AuthContext";

const navigation = [
  { name: "לוח בקרה", href: "/", icon: LayoutDashboard },
  { name: "ניהול רכבים", href: "/garage", icon: Car },
  { name: "העלאת מסמכים", href: "/upload", icon: Upload },
  { name: "ציר זמן", href: "/timeline", icon: Clock },
  { name: "צ'אט המכונאי", href: "/chat", icon: MessageSquare },
  { name: "מתקדם", href: "/observability", icon: Activity },
  { name: "הגדרות ואבטחה", href: "/settings", icon: Settings },
];

const cars = [
  { id: "1", name: "מאזדה 3 - שלי", year: "2019" },
  { id: "2", name: "טויוטה קורולה - של דנה", year: "2021" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, loading, logout, userId } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login only after auth has finished loading
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavigationItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = 
          item.href === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.href);
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 bg-card border-l border-border flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Logo />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <NavigationItems />
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <User className="w-5 h-5" />
                  <div className="flex-1 text-right">
                    <p className="text-sm">משתמש</p>
                    <p className="text-xs text-muted-foreground">{userId?.slice(0, 8)}...</p>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="ml-2 w-4 h-4" />
                  <span>פרופיל</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="ml-2 w-4 h-4" />
                  <span>התנתק</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Logo */}
                  <div className="p-6 border-b border-border">
                    <Logo />
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4 space-y-1 overflow-auto">
                    <NavigationItems onItemClick={() => setMobileMenuOpen(false)} />
                  </nav>

                  {/* User section */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1 text-right">
                        <p className="text-sm font-medium">משתמש</p>
                        <p className="text-xs text-muted-foreground">{userId?.slice(0, 8)}...</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <User className="w-4 h-4" />
                        <span>פרופיל</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                        <span>התנתק</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Car selector */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" size={isMobile ? "sm" : "default"}>
                  <ChevronDown className="w-4 h-4" />
                  <span className={isMobile ? "max-w-[120px] truncate" : ""}>{cars[0].name}</span>
                  <Car className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {cars.map((car) => (
                  <DropdownMenuItem key={car.id}>
                    <div className="flex flex-col items-end w-full">
                      <span className="font-medium">{car.name}</span>
                      <span className="text-xs text-muted-foreground">שנת {car.year}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop user menu */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="ml-2 w-4 h-4" />
                    <span>פרופיל</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="ml-2 w-4 h-4" />
                    <span>התנתק</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}