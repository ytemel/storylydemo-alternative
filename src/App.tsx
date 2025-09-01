import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import { StorylyDesignShowcase } from "@/components/storyly-design-showcase";
import { SidebarShowcase } from "@/components/sidebar-showcase";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/:section" component={Dashboard} />
      <Route path="/dashboard/stories/:sub" component={Dashboard} />
      <Route path="/dashboard/recipes/widgets" component={Dashboard} />
      <Route path="/design-system" component={StorylyDesignShowcase} />
      <Route path="/sidebar-showcase" component={SidebarShowcase} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  console.log("App component rendering...");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
