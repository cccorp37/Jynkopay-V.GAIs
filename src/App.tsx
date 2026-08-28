import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import KYC from "./pages/KYC";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
// Dashboard Pages
import Wallet from "./pages/dashboard/Wallet";
import Cards from "./pages/dashboard/Cards";
import Store from "./pages/dashboard/Store";
import Analytics from "./pages/dashboard/Analytics";
import CRM from "./pages/dashboard/CRM";
import Settings from "./pages/dashboard/Settings";
import PlatformOrdering from "./pages/dashboard/PlatformOrdering";
import SocialBoost from "./pages/dashboard/SocialBoost";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HelpContact from "./pages/dashboard/HelpContact";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
      <Route path="/dashboard/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
      <Route path="/dashboard/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
      <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/dashboard/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/dashboard/platform-order" element={<ProtectedRoute><PlatformOrdering /></ProtectedRoute>} />
      <Route path="/dashboard/social-boost" element={<ProtectedRoute><SocialBoost /></ProtectedRoute>} />
      <Route path="/dashboard/help" element={<ProtectedRoute><HelpContact /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
