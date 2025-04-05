
import React from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BudgetsSummary = () => {
  const { state, formatCurrency } = useFinance();

  // Calculate total budgeted amount
  const totalBudgeted = state.budgets.reduce((total, budget) => total + budget.amount, 0);
  
  // Calculate total expenses amount
  const totalExpenses = state.transactions
    .filter(t => t.isExpense)
    .reduce((total, t) => total + t.amount, 0);
  
  // Calculate the remaining budget
  const remainingBudget = totalBudgeted - totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Orçamentado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalBudgeted)}
          </div>
          <p className="text-xs text-muted-foreground">
            Para {state.budgets.length} {state.budgets.length === 1 ? 'categoria' : 'categorias'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round((totalExpenses / totalBudgeted) * 100) || 0}% do orçamento total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Orçamento Restante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(Math.abs(remainingBudget))}
          </div>
          <p className="text-xs text-muted-foreground">
            {remainingBudget >= 0 ? 'Disponível para gastar' : 'Acima do orçamento'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetsSummary;
