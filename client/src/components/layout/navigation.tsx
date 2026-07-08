import { Link, useLocation } from "wouter";
import { Scale, Bell, User, Menu, FileText, Zap, Users, Shield, Settings, LogOut, Clock, FolderOpen, BookOpen, Gavel, Wand2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

interface NavGroup {
  label: string;
  items: Array<{ path: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "My Cases",
    items: [
      { path: "/", label: "Dashboard", icon: Scale },
      { path: "/case-management", label: "Case Management", icon: Shield },
      { path: "/timeline-builder", label: "Timeline Builder", icon: Clock },
      { path: "/evidence-manager", label: "Evidence Manager", icon: FolderOpen },
    ],
  },
  {
    label: "Filing Tools",
    items: [
      { path: "/file-document", label: "File Document", icon: FileText },
      { path: "/emergency-filing", label: "Emergency Filing", icon: Zap },
      { path: "/document-generator", label: "Doc Generator", icon: Wand2 },
      { path: "/deadline-manager", label: "Deadline Manager", icon: Clock },
    ],
  },
  {
    label: "Research",
    items: [
      { path: "/court-rules", label: "Court Rules", icon: Gavel },
      { path: "/research-library", label: "Research Library", icon: BookOpen },
      { path: "/pro-bono-search", label: "Pro Bono Search", icon: Users },
    ],
  },
  {
    label: "My Estate",
    items: [
      { path: "/probate-module", label: "Probate Module", icon: Scale },
    ],
  },
  {
    label: "Account",
    items: [
      { path: "/subscribe", label: "Subscribe", icon: Settings },
      { path: "/account", label: "Account", icon: User },
      { path: "/mpc-assistant", label: "MPC AI Assistant", icon: Shield },
    ],
  },
];

// Flat list for mobile
const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function NavDropdown({ group, location }: { group: NavGroup; location: string }) {
  const isActive = group.items.some((item) => item.path === location);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          }`}
        >
          <span>{group.label}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 z-[60]">
        {group.items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <DropdownMenuItem className={`flex items-center gap-2 cursor-pointer ${location === item.path ? "bg-blue-50 text-blue-700" : ""}`}>
                <Icon className={`h-4 w-4 ${location === item.path ? "text-blue-600" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </DropdownMenuItem>
            </Link>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } bg-[#1a1a1a] shadow-lg border-b border-gray-800`}
        data-testid="navigation"
        style={{ height: "80px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center" data-testid="logo-link">
                <img
                  src="https://legaleasefile.online/assets/images/logo-black.png"
                  alt="LegalEase File"
                  className="h-12 w-auto"
                />
              </Link>

              {/* Desktop Nav — grouped dropdowns */}
              <div className="ml-4 hidden lg:flex items-center space-x-1">
                {NAV_GROUPS.map((group) => (
                  <NavDropdown key={group.label} group={group} location={location} />
                ))}
              </div>
            </div>

            {/* Right side */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700"
                  data-testid="notifications-button"
                >
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-white hover:bg-gray-700 px-3 py-2 rounded-lg"
                      data-testid="user-menu-button"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                        <User className="text-white text-sm" />
                      </div>
                      <span className="text-sm font-medium">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.email || "User"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[60]">
                    <DropdownMenuItem onClick={() => (window.location.href = "/account")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => (window.location.href = "/account")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => (window.location.href = "/api/logout")}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={() => (window.location.href = "/api/login")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white" data-testid="mobile-menu-button">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white overflow-y-auto">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-6 pb-4 border-b">
                      <img
                        src="https://legaleasefile.online/assets/images/logo-black.png"
                        alt="LegalEase File"
                        className="h-10 w-auto"
                      />
                    </div>

                    {NAV_GROUPS.map((group) => (
                      <div key={group.label} className="mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">{group.label}</p>
                        <div className="space-y-1">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link key={item.path} href={item.path}>
                                <button
                                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    location === item.path
                                      ? "bg-blue-50 text-blue-700 font-medium"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <Icon className={`h-4 w-4 ${location === item.path ? "text-blue-600" : "text-gray-400"}`} />
                                  {item.label}
                                </button>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {isAuthenticated && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                            <User className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user?.email || "User"}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => (window.location.href = "/api/logout")}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-20" />
    </>
  );
}
