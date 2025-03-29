
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  ReceiptText, 
  PieChart, 
  Target, 
  CircleDollarSign 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { toast } = useToast();

  const navigationItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: Home,
      description: "Visão geral financeira" 
    },
    { 
      name: "Transações", 
      path: "/transactions", 
      icon: ReceiptText,
      description: "Registrar e visualizar receitas e despesas" 
    },
    { 
      name: "Orçamentos", 
      path: "/budgets", 
      icon: PieChart,
      description: "Definir e gerenciar orçamentos" 
    },
    { 
      name: "Metas", 
      path: "/goals", 
      icon: Target,
      description: "Definir e acompanhar metas financeiras" 
    },
    { 
      name: "Dívidas", 
      path: "/debts", 
      icon: CircleDollarSign,
      description: "Gerenciar e acompanhar dívidas" 
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSyncClick = () => {
    toast({
      title: "Dados sincronizados",
      description: "Seus dados foram salvos localmente com sucesso",
      duration: 3000,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <div className="py-4 px-3 flex flex-col h-full">
            <div className="flex items-center px-2 mb-6">
              <div className="flex items-center space-x-2">
                <CircleDollarSign className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">KwanzaSmart</h1>
              </div>
            </div>
            <SidebarContent className="flex-1">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </SidebarContent>
            <div className="mt-auto border-t pt-4">
              <button
                onClick={handleSyncClick}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span>Sincronizar dados</span>
              </button>
            </div>
          </div>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {navigationItems.find((item) => isActive(item.path))?.name || "KwanzaSmart"}
              </h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
