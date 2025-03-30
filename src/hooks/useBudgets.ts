
import { Budget } from "@/types/finance";

export const useBudgets = (dispatch: React.Dispatch<any>) => {
  // Budgets methods
  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    dispatch({ type: "ADD_BUDGET", budget: newBudget });
  };

  const updateBudget = (budget: Budget) => {
    dispatch({ type: "UPDATE_BUDGET", budget });
  };

  const deleteBudget = (id: string) => {
    dispatch({ type: "DELETE_BUDGET", id });
  };

  return {
    addBudget,
    updateBudget,
    deleteBudget
  };
};
