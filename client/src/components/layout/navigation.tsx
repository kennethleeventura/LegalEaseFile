import { Link, useLocation } from "wouter";
import { Scale, Bell, User, Menu, FileText, Zap, Users, Shield, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => window.removeEventListener('scroll', controlNavbar);
    }
  }, [lastScrollY]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: Scale, testId: "nav-dashboard" },
    { path: "/file-document", label: "File Document", icon: FileText, testId: "nav-file-document" },
    { path: "/emergency-filing", label: "Emergency Filing", icon: Zap, testId: "nav-emergency" },
    { path: "/pro-bono-search", label: "Find Legal Help", icon: Users, testId: "nav-probono" },
    { path: "/case-management", label: "Case Management", icon: Shield, testId: "nav-case-management" },
    { path: "/mpc-assistant", label: "MPC AI Assistant", icon: Shield, testId: "nav-mpc-assistant" },
  ];

  const NavLinks = ({ mobile = false }) => (
    <div className={mobile ? "flex flex-col space-y-4" : "hidden lg:flex items-center space-x-1"}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.path} href={item.path}>
            <Button
              variant={location === item.path ? "default" : "ghost"}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 ${
                location === item.path 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              data-testid={item.testId}
            >
              <Icon className={`h-4 w-4 ${location === item.path ? 'text-white' : 'text-blue-400'}`} />
              <span>{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } bg-[#1a1a1a] shadow-lg border-b border-gray-800`} 
        data-testid="navigation"
        style={{ height: '80px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Link href="/" className="flex items-center" data-testid="logo-link">
                <img 
                  src="https://legaleasefile.online/assets/images/logo-black.png" 
                  alt="LegalEase File" 
                  className="h-12 w-auto"
                />
              </Link>
              <div className="ml-8">
                <NavLinks />
              </div>
            </div>

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
                          : user?.email || 'User'
                        }
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => window.location.href = '/account'}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/account'}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Sign In
              </Button>
            )}

            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white" data-testid="mobile-menu-button">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-8 pb-4 border-b">
                      <img 
                        src="https://legaleasefile.online/assets/images/logo-black.png" 
                        alt="LegalEase File" 
                        className="h-10 w-auto"
                      />
                    </div>
                    <NavLinks mobile />
                    {isAuthenticated && (
                      <div className="mt-8 pt-4 border-t">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                            <User className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user?.firstName && user?.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user?.email || 'User'
                              }
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => window.location.href = '/api/logout'}
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