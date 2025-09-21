import { Link, useLocation } from "wouter";
import { Scale, Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect } from "react";

export default function Navigation() {
  const [location] = useLocation();

  useEffect(() => {
    // Navigation is always sticky - no hiding/showing behavior
    const nav = document.querySelector('[data-testid="navigation"]') as HTMLElement;
    if (nav) {
      nav.style.transform = 'translateY(0)'; // Always visible
      nav.style.position = 'fixed';
      nav.style.top = '0';
      nav.style.width = '100%';
      nav.style.zIndex = '1000';
    }
  }, []);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", testId: "nav-dashboard" },
    { path: "/file-document", label: "File Document", testId: "nav-file-document" },
    { path: "/emergency-filing", label: "Emergency Filing", testId: "nav-emergency" },
    { path: "/pro-bono-search", label: "Find Legal Help", testId: "nav-probono" },
    { path: "/case-management", label: "Case Management", testId: "nav-case-management" },
    { path: "/mpc-assistant", label: "MPC AI Assistant", testId: "nav-mpc-assistant" },
  ];

  const NavLinks = ({ mobile = false }) => (
    <div className={mobile ? "flex flex-col space-y-4" : "hidden md:flex items-baseline space-x-4"}>
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <Button
            variant={location === item.path ? "default" : "ghost"}
            className={location === item.path
              ? "border-b-2 border-[#FF5A5F] bg-[#FF5A5F] text-white"
              : "text-white hover:text-[#FF5A5F] hover:bg-gray-800"
            }
            data-testid={item.testId}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="fixed top-0 w-full shadow-sm border-b border-gray-700 z-50 transition-transform duration-300 ease-in-out" style={{backgroundColor: '#3a4956'}} data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center" data-testid="logo-link">
              <img
                src="/assets/images/logo-black.png"
                alt="LegalEaseFile Logo"
                className="h-16 w-auto mr-3 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-8 h-8 bg-[#FF5A5F] rounded flex items-center justify-center mr-3 hidden">
                <span className="text-white font-bold text-xs">L</span>
              </div>
            </Link>
            <div className="ml-10">
              <NavLinks />
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 rounded-full text-gray-300 hover:text-[#FF5A5F]"
                data-testid="notifications-button"
              >
                <Bell className="h-5 w-5 gradient-icon" />
              </Button>
              <div className="ml-3 relative">
                <Button
                  variant="ghost"
                  className="max-w-xs flex items-center text-sm rounded-full text-white hover:bg-gray-800"
                  data-testid="user-menu-button"
                >
                  <div className="h-8 w-8 rounded-full border border-gray-600 flex items-center justify-center">
                    <User className="h-4 w-4 gradient-icon" />
                  </div>
                  <span className="ml-2 text-white text-sm font-medium">John Smith</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-[#FF5A5F]" data-testid="mobile-menu-button">
                  <Menu className="h-6 w-6 gradient-icon" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-8">
                    <img
                      src="/assets/images/logo-black.png"
                      alt="LegalEaseFile Logo"
                      className="h-8 w-auto mr-2 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-6 h-6 bg-[#FF5A5F] rounded flex items-center justify-center mr-2 hidden">
                      <span className="text-white font-bold text-xs">L</span>
                    </div>
                  </div>
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
