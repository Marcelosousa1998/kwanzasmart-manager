
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import SummaryCards from "./components/SummaryCards";
import ActionButtons from "./components/ActionButtons";
import OverviewChart from "./components/OverviewChart";
import BudgetProgress from "./components/BudgetProgress";
import DashboardTabs from "./components/DashboardTabs";
import SavingGoals from "./components/SavingGoals";
import { useFinance } from "@/contexts/FinanceContext";

const Dashboard = () => {
  const { fetchTransactions } = useFinance();

  useEffect(() => {
    // Fetch transactions when the dashboard loads
    fetchTransactions();
  }, [fetchTransactions]);

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
