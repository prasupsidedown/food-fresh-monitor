import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Thermometer, 
  Database, 
  Wind, 
  LogOut, 
  Menu,
  X
} from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const navigationItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: Activity
    },
    {
      path: "/temperature-humidity",
      label: "Data Suhu & Kelembaban",
      icon: Thermometer
    },
    {
      path: "/air-quality",
      label: "Timeline Air Quality",
      icon: Wind
    },
    {
      path: "/database",
      label: "Database Sensor",
      icon: Database
    }
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg gradient-primary">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-iot-primary to-iot-secondary bg-clip-text text-transparent">
              IoT Monitor
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 ${
                    isActive 
                      ? "gradient-primary text-white shadow-medium" 
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2 ml-4"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start flex items-center space-x-2 ${
                    isActive 
                      ? "gradient-primary text-white" 
                      : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start flex items-center space-x-2 mt-4"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;