
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FinanceProvider } from "./contexts/FinanceContext";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Debts from "./pages/Debts";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Criando o cliente de consulta fora do componente
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas de autenticação - outside of FinanceProvider since they don't need financial data */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas protegidas - wrapped in FinanceProvider */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <FinanceProvider>
                  <TooltipProvider>
                    <Dashboard />
                  </TooltipProvider>
                </FinanceProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <FinanceProvider>
                  <TooltipProvider>
                    <Transactions />
                  </TooltipProvider>
                </FinanceProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <ProtectedRoute>
                <FinanceProvider>
                  <TooltipProvider>
                    <Budgets />
                  </TooltipProvider>
                </FinanceProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <FinanceProvider>
                  <TooltipProvider>
                    <Goals />
                  </TooltipProvider>
                </FinanceProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/debts"
            element={
              <ProtectedRoute>
                <FinanceProvider>
                  <TooltipProvider>
                    <Debts />
                  </TooltipProvider>
                </FinanceProvider>
              </ProtectedRoute>
            }
          />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
