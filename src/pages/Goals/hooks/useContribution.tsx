
import { useState, useEffect } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { useGoalDialogs, setContributionAmountExport } from "./useGoalDialogs";

export const useContribution = () => {
  const [contributionAmount, setContributionAmount] = useState("");
  const { state, updateGoal, formatCurrency } = useFinance();
  const { toast } = useToast();
  const { setContributionDialogOpen } = useGoalDialogs();

  // Connect the setter to the exportable function to avoid circular imports
  useEffect(() => {
    setContributionAmountExport(setContributionAmount);
  }, []);

  const handleAddContribution = (selectedGoalId: string | null) => {
    if (!selectedGoalId) return;
    
    const amount = parseFloat(contributionAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }
    
    const goal = state.goals.find(g => g.id === selectedGoalId);
    if (!goal) return;
    
    const updatedGoal = {
      ...goal,
      currentAmount: goal.currentAmount + amount,
    };
    
    updateGoal(updatedGoal);
    
    toast({
      title: "Contribuição adicionada",
      description: `${formatCurrency(amount)} adicionado à meta "${goal.name}"`,
    });
    
    setContributionDialogOpen(false);
  };

  return {
    contributionAmount,
    setContributionAmount,
    handleAddContribution
  };
};
