
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import SummaryCards from "./components/SummaryCards";
import ActionButtons from "./components/ActionButtons";
import OverviewChart from "./components/OverviewChart";
import BudgetProgress from "./components/BudgetProgress";
import DashboardTabs from "./components/DashboardTabs";
import SavingGoals from "./components/SavingGoals";
import { useFinance } from "@/contexts/FinanceContext";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { fetchTransactions, isLoading } = useFinance();

  useEffect(() => {
    // Fetch transactions when the dashboard loads
    fetchTransactions();
  }, [fetchTransactions]);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-[200px]" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 grid gap-4 lg:col-span-2">
              <Skeleton className="h-[300px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
            <div className="col-span-2 grid gap-4 lg:col-span-1">
              <Skeleton className="h-[250px] w-full rounded-lg" />
              <Skeleton className="h-[250px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <SummaryCards />
        <ActionButtons />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2 grid gap-4 lg:col-span-2">
            <OverviewChart />
            <BudgetProgress />
          </div>

          <div className="col-span-2 grid gap-4 lg:col-span-1">
            <DashboardTabs />
            <SavingGoals />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
