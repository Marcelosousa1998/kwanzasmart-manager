
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import GoalsList from "./components/GoalsList";
import AddGoalDialog from "./components/AddGoalDialog";
import TipsCard from "./components/TipsCard";
import GoalsWrapper from "./components/GoalsWrapper";
import { useFinance } from "@/contexts/FinanceContext";

const GoalsPage = () => {
  const { fetchTransactions, state } = useFinance();

  // Buscar os dados sempre que a página for carregada
  useEffect(() => {
    // Buscar transações se ainda não foram carregadas
    if (state.transactions.length === 0) {
      fetchTransactions();
    }
  }, [fetchTransactions, state.transactions.length]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Metas Financeiras</h1>
          <AddGoalDialog />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GoalsList />
          </div>
          <div className="lg:col-span-1">
            <TipsCard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const WrappedGoalsPage = () => (
  <GoalsWrapper>
    <GoalsPage />
  </GoalsWrapper>
);

export default WrappedGoalsPage;
