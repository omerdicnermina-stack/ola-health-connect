import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
