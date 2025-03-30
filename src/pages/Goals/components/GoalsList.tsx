
import React from "react";
import { Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Goal } from "@/types/finance";
import GoalCard from "./GoalCard";
import { useFinance } from "@/contexts/FinanceContext";
import { useGoalDialogs } from "../hooks/useGoalDialogs";

const GoalsList = () => {
  const { state } = useFinance();
  const { setOpenAddDialog } = useGoalDialogs();
  const goals = state.goals;

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Target className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Nenhuma meta definida</h2>
          <p className="text-muted-foreground text-center mb-4">
            Defina metas financeiras para acompanhar seu progresso e realizar seus sonhos.
          </p>
          <Button onClick={() => setOpenAddDialog(true)}>
            Criar Primeira Meta
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default GoalsList;
