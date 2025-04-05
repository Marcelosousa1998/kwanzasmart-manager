
import React, { useEffect } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import BudgetsPage from "./BudgetsPage";
import { Skeleton } from "@/components/ui/skeleton";

const BudgetsContainer = () => {
  const { fetchTransactions, isLoading } = useFinance();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[160px]" />
            <Skeleton className="h-10 w-[150px] rounded-md" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
          </div>
          
          <Skeleton className="h-[350px] w-full rounded-lg" />
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
      </Layout>
    );
  }

  return <BudgetsPage />;
};

export default BudgetsContainer;
