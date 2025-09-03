import { Link, useLocation } from "wouter";
import { Scale, Bell, User, Menu, Sparkles, ShoppingBag, BarChart3, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", testId: "nav-dashboard", icon: null },
    { path: "/file-document", label: "File Document", testId: "nav-file-document", icon: null },
    { path: "/emergency-filing", label: "Emergency Filing", testId: "nav-emergency", icon: null },
    { path: "/pro-bono-search", label: "Find Legal Help", testId: "nav-probono", icon: null },
    { path: "/case-management", label: "Case Management", testId: "nav-case-management", icon: null },
    { path: "/mpc-assistant", label: "MPC AI Assistant", testId: "nav-mpc-assistant", icon: null },
  ];

  const premiumNavItems = [
    {
      path: "/marketplace",
      label: "Marketplace",
      testId: "nav-marketplace",
      icon: <ShoppingBag className="w-4 h-4 mr-1" />,
      badge: "45+ SERVICES"
    },
    {
      path: "/pricing",
      label: "Pricing",
      testId: "nav-pricing",
      icon: <Gift className="w-4 h-4 mr-1" />,
      badge: "FREE TRIAL"
    },
    {
      path: "/analytics",
      label: "Analytics",
      testId: "nav-analytics",
      icon: <BarChart3 className="w-4 h-4 mr-1" />,
      badge: null
    },
  ];

  const NavLinks = ({ mobile = false }) => (
    <div className={mobile ? "flex flex-col space-y-4" : "hidden lg:flex items-baseline space-x-2"}>
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <Button
            variant={location === item.path ? "default" : "ghost"}
            className={`${location === item.path ? "bg-blue-600 text-white" : ""} text-sm`}
            data-testid={item.testId}
          >
            {item.icon}
            {item.label}
          </Button>
        </Link>
      ))}

      {/* Premium Navigation Items */}
      <div className="border-l border-gray-300 pl-2 ml-2">
        {premiumNavItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <Button
              variant={location === item.path ? "default" : "ghost"}
              className={`${location === item.path ? "bg-purple-600 text-white" : "text-purple-600 hover:bg-purple-50"} text-sm relative`}
              data-testid={item.testId}
            >
              {item.icon}
              {item.label}
              {item.badge && (
                <Badge className="ml-2 bg-green-500 text-white text-xs px-1 py-0">
                  {item.badge}
                </Badge>
              )}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" data-testid="logo-link">
              <div className="relative">
                <Scale className="text-blue-600 text-2xl mr-3" />
                <Sparkles className="absolute -top-1 -right-1 text-yellow-500 text-sm animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LegalEaseFile
                </span>
                <div className="flex items-center space-x-1 -mt-1">
                  <Gift className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Always Free</span>
                </div>
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
