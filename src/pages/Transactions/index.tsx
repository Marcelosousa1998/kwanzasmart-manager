
import React, { useEffect } from "react";
import TransactionsPage from "./TransactionsPage";
import { useFinance } from "@/contexts/FinanceContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionsContainer = () => {
  const { fetchTransactions, isLoading } = useFinance();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.info("TransactionsPage mounted, fetching transactions");
      fetchTransactions();
    }
  }, [fetchTransactions, user]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-[180px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }
  
  return <TransactionsPage />;
};

export default TransactionsContainer;
