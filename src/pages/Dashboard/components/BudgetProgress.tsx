
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import CategoryIcon from "@/components/CategoryIcon";
import { getCategoryLabel } from "@/utils/categoryUtils";

const BudgetProgress = () => {
  const { state, formatCurrency, getTotalExpenses } = useFinance();

  const budgetProgress = state.budgets.map(budget => {
    const percentUsed = (budget.spent / budget.amount) * 100;
    const isOverBudget = percentUsed > 100;
    return {
      ...budget,
      percentUsed,
      isOverBudget,
    };
  }).sort((a, b) => b.percentUsed - a.percentUsed);

  const totalBudgetedExpenses = state.budgets.reduce(
    (total, budget) => total + budget.amount,
    0
  );

  const totalActualExpenses = getTotalExpenses();
  const budgetedVsActualPercentage = totalBudgetedExpenses > 0
    ? (totalActualExpenses / totalBudgetedExpenses) * 100
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Orçamento vs. Despesas</CardTitle>
        <CardDescription>
          {formatCurrency(totalActualExpenses)} de {formatCurrency(totalBudgetedExpenses)} (
          {Math.round(budgetedVsActualPercentage)}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress 
          value={budgetedVsActualPercentage > 100 ? 100 : budgetedVsActualPercentage} 
          className={budgetedVsActualPercentage > 100 ? "bg-red-200" : ""}
        />
        
        <div className="space-y-2 mt-4">
          {budgetProgress.slice(0, 3).map((budget) => (
            <div key={budget.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <CategoryIcon category={budget.category} className="h-4 w-4" />
                  <span>{getCategoryLabel(budget.category)}</span>
                </div>
                <span className={budget.isOverBudget ? "text-red-500" : ""}>
                  {formatCurrency(budget.spent)}/{formatCurrency(budget.amount)}
                </span>
              </div>
              <Progress 
                value={budget.percentUsed > 100 ? 100 : budget.percentUsed} 
                className={budget.isOverBudget ? "bg-red-200" : ""}
              />
            </div>
          ))}
        </div>
        
        {state.budgets.length > 3 && (
          <div className="mt-3 text-center">
            <Button variant="link" asChild>
              <Link to="/budgets">Ver todos os orçamentos</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
