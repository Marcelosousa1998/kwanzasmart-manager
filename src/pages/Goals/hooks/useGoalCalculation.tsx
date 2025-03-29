
import { Goal } from "@/types/finance";

export const useGoalCalculation = () => {
  const calculateProgress = (goal: Goal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const calculateMonthlyContribution = (goal: Goal) => {
    const today = new Date();
    const targetDay = new Date(goal.targetDate);
    const monthsDiff = (targetDay.getFullYear() - today.getFullYear()) * 12 + 
                       (targetDay.getMonth() - today.getMonth());
    
    if (monthsDiff <= 0) return 0;
    
    const remaining = goal.targetAmount - goal.currentAmount;
    return remaining / monthsDiff;
  };

  const calculateDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const timeDiff = target.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return {
    calculateProgress,
    calculateMonthlyContribution,
    calculateDaysRemaining
  };
};
