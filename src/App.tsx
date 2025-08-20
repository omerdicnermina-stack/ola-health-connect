import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import VirtualQueue from "./pages/VirtualQueue";
import Messages from "./pages/Messages";
import Prescriptions from "./pages/Prescriptions";
import Patients from "./pages/Patients";
import Users from "./pages/Users";
import Organizations from "./pages/Organizations";
import Statistics from "./pages/Statistics";
import Services from "./pages/Services";
import Plans from "./pages/Plans";
import Visits from "./pages/Visits";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading, isAuthenticated } = useAuth();
  
  console.log('AppContent render:', { 
    hasUser: !!user, 
    loading, 
    isAuthenticated,
    userEmail: user?.email
  });

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!isAuthenticated || !user) {
    return <AuthForm />;
  }

  // Show dashboard if authenticated
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/virtual-queue" element={<VirtualQueue />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/users" element={<Users />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/services" element={<Services />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;