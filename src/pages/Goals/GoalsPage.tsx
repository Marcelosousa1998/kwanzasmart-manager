
import React from "react";
import Layout from "@/components/Layout";
import { useFinance } from "@/contexts/FinanceContext";
import GoalsList from "./components/GoalsList";
import AddGoalDialog from "./components/AddGoalDialog";
import TipsCard from "./components/TipsCard";
import GoalsWrapper from "./components/GoalsWrapper";

const GoalsPage = () => {
  const { state } = useFinance();

  return (
    <Layout>
      <GoalsWrapper>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Metas de Poupança</h1>
            <AddGoalDialog />
          </div>

          <GoalsList goals={state.goals} />
          <TipsCard />
        </div>
      </GoalsWrapper>
    </Layout>
  );
};

export default GoalsPage;
