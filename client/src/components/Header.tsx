import { useAppContext } from "@/context/AppContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity, TerminalSquare, Code, User, BarChart } from "lucide-react";
import { useEffect } from "react";



export default function Header() {
  const { setModalOpen, activeView, setActiveView } = useAppContext();
  const [location, navigate] = useLocation();

  const handleNavigation = (path: string, view: 'dashboard' | 'terminal' | 'api') => {
    navigate(path);
    setActiveView(view);
  };
  
  const isHome = location === "/";
  const isProfileActive = location === "/profile";

  useEffect(() => {
    if (location === "/") {
      setActiveView(null);
    }
  }, [location, setActiveView]);
  
  return (
    <header className="bg-background border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <a className="font-mono font-bold text-xl text-gray-100">~/home</a>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button 
            variant={activeView === 'dashboard' && !isHome ? "default" : "ghost"}
            size="sm"
            className="gap-2 text-gray-100"
            onClick={() => handleNavigation("/dashboard", "dashboard")}
          >
            <BarChart className="h-4 w-4 text-gray-100" />
            Dashboard
          </Button>
          
          <Button 
            variant={activeView === 'terminal' && !isHome ? "default" : "ghost"}
            size="sm"
            className="gap-2 text-gray-100"
            onClick={() => handleNavigation("/terminal", "terminal")}
          >
            <TerminalSquare className="h-4 w-4 text-gray-100" />
            Terminal
          </Button>
          
          <Button 
            variant={activeView === 'api' && !isHome ? "default" : "ghost"}
            size="sm"
            className="gap-2 text-gray-100"
            onClick={() => handleNavigation("/api", "api")}
          >
            <Code className="h-4 w-4 text-gray-100" />
            API Explorer
          </Button>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex text-gray-100"
            onClick={() => window.open("https://siddhants-travel-tails.vercel.app/", "_blank")}
          >
            Travel Blog
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex text-gray-100"
            onClick={() => window.open("https://www.linkedin.com/in/siddhant-shambharkar/", "_blank")}
          >
            LinkedIn
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex text-gray-100"
            onClick={() => window.open("https://shambharkarsiddhant.medium.com/", "_blank")}
          >
            Medium
          </Button>
          <Button 
            variant={isProfileActive ? "default" : "ghost"} 
            size="icon"
            onClick={() => {
              navigate("/profile");
              setActiveView(null);
            }}
            title="Developer Profile"
          >
            <User className="h-5 w-5 text-gray-100" />
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
          <Button 
            variant="ghost" 
            className={`rounded-none h-12 ${activeView === 'dashboard' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            onClick={() => handleNavigation("/dashboard", "dashboard")}
          >
            <div className="flex flex-col items-center justify-center">
              <BarChart className="h-4 w-4" />
              <span className="text-xs mt-1">SysArch</span>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className={`rounded-none h-12 ${activeView === 'terminal' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            onClick={() => handleNavigation("/terminal", "terminal")}
          >
            <div className="flex flex-col items-center justify-center">
              <TerminalSquare className="h-4 w-4" />
              <span className="text-xs mt-1">Terminal</span>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className={`rounded-none h-12 ${activeView === 'api' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            onClick={() => handleNavigation("/api", "api")}
          >
            <div className="flex flex-col items-center justify-center">
              <Code className="h-4 w-4" />
              <span className="text-xs mt-1">API</span>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className={`rounded-none h-12 ${isProfileActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            onClick={() => navigate("/profile")}
          >
            <div className="flex flex-col items-center justify-center">
              <User className="h-4 w-4" />
              <span className="text-xs mt-1">Profile</span>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
