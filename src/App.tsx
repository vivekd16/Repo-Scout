import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";

// Import all pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Top from "./pages/Top";
import Popular from "./pages/Popular";
import Growing from "./pages/Growing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Demo from "./pages/Demo";
import Guidance from "./pages/Guidance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/top" element={<Top />} />
              <Route path="/popular" element={<Popular />} />
              <Route path="/growing" element={<Growing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/guidance" element={<Guidance />} />
              {/* Profile and Settings routes - placeholder for now */}
              <Route path="/profile" element={<div className="p-6"><h1>Profile Page - Coming Soon</h1></div>} />
              <Route path="/settings" element={<div className="p-6"><h1>Settings Page - Coming Soon</h1></div>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
