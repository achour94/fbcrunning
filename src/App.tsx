import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MockBackendProvider } from "@/context/MockBackendContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import CreateRun from "@/pages/CreateRun";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MockBackendProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-run" element={<CreateRun />} />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MockBackendProvider>
  </QueryClientProvider>
);

export default App;
