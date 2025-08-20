import { Link, useLocation } from "wouter";
import { Scale, Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", testId: "nav-dashboard" },
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
            className={location === item.path ? "border-b-2 border-primary-600" : ""}
            data-testid={item.testId}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" data-testid="logo-link">
              <Scale className="text-primary-600 text-2xl mr-3" />
              <span className="text-xl font-bold text-gray-900">LegalFile AI</span>
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
                className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                data-testid="notifications-button"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="ml-3 relative">
                <Button
                  variant="ghost"
                  className="max-w-xs flex items-center text-sm rounded-full"
                  data-testid="user-menu-button"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="text-primary-600 text-sm" />
                  </div>
                  <span className="ml-2 text-gray-700 text-sm font-medium">John Smith</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="mobile-menu-button">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-8">
                    <Scale className="text-primary-600 text-xl mr-2" />
                    <span className="text-lg font-bold text-gray-900">LegalFile AI</span>
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
