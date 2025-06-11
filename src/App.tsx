import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Guidance from "./pages/Guidance";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import AuthModal from "./components/AuthModal";

// Debugging: Log all environment variables available to Vite
// console.log('All VITE_ environment variables:', import.meta.env);

const queryClient = new QueryClient();

// New component to render AuthModal conditionally
const AuthModalRenderer = () => {
  const { user } = useAuth();
  const shouldShowAuthModal = !user;

  return (
    <AuthModal
      isOpen={shouldShowAuthModal}
      onClose={() => { /* No direct close button, login/signup handles it */ }}
    />
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/guidance" element={<Guidance />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          {/* Render the new AuthModalRenderer component */}
          <AuthModalRenderer />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
