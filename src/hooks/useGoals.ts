
import { Goal } from "@/types/finance";

export const useGoals = (dispatch: React.Dispatch<any>) => {
  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    dispatch({ type: "ADD_GOAL", goal: newGoal });
  };

  const updateGoal = (goal: Goal) => {
    dispatch({ type: "UPDATE_GOAL", goal });
  };

  const deleteGoal = (id: string) => {
    dispatch({ type: "DELETE_GOAL", id });
  };

  return {
    addGoal,
    updateGoal,
    deleteGoal
  };
};
