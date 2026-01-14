import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, Calendar, Flag, LogOut, User, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/predictions", label: "Predictions", icon: Flag },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  if (user?.isAdmin) {
    navItems.push({ href: "/admin", label: "Admin", icon: Settings });
  }

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary skew-x-[-12deg] flex items-center justify-center group-hover:bg-white transition-colors">
                <span className="font-display font-bold text-white group-hover:text-primary text-sm skew-x-[12deg]">F1</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tighter text-white">
                CHAMPIONSHIP
                <span className="text-primary ml-1">'26</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    location === item.href
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: user.color }} 
                  />
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logoutMutation.mutate()}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden border-t border-border/50 overflow-x-auto scrollbar-hide">
        <div className="flex p-2 gap-2 min-w-max">
           {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 px-4 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2",
                  location === item.href
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
}
