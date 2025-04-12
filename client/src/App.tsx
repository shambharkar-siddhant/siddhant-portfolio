import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/not-found";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Terminal from "./pages/Terminal";
import ApiPlayground from "./pages/ApiPlayground";
import Profile from "./pages/Profile";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/terminal" component={Terminal} />
      <Route path="/api" component={ApiPlayground} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="min-h-screen bg-background text-gray-800 dark:text-gray-200 flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Toaster />
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
