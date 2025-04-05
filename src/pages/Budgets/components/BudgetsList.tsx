
import React from "react";
import { Trash2 } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { getCategoryLabel } from "@/utils/categoryUtils";
import CategoryIcon from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetsListProps {
  onDeleteBudget: (id: string) => void;
}

const BudgetsList = ({ onDeleteBudget }: BudgetsListProps) => {
  const { state, formatCurrency } = useFinance();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamentos por Categoria</CardTitle>
        <CardDescription>
          Gerencie seus limites de gastos por categoria
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {state.budgets.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-4">
              Você ainda não definiu nenhum orçamento.
            </p>
            <Button onClick={() => document.getElementById("add-budget-trigger")?.click()}>
              Criar Primeiro Orçamento
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Orçado</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Gasto</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Restante</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Progresso</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {state.budgets.map((budget) => {
                  const percentUsed = (budget.spent / budget.amount) * 100;
                  const isOverBudget = percentUsed > 100;
                  return (
                    <tr key={budget.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={budget.category} />
                          <span className="font-medium">{getCategoryLabel(budget.category)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatCurrency(budget.amount)}
                        <div className="text-xs text-muted-foreground">
                          {budget.period === "monthly" ? "Mensal" : "Semanal"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatCurrency(budget.spent)}
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                        {isOverBudget 
                          ? `-${formatCurrency(budget.spent - budget.amount)}`
                          : formatCurrency(budget.amount - budget.spent)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center w-full max-w-xs">
                          <Progress 
                            value={percentUsed > 100 ? 100 : percentUsed} 
                            className={`h-2 w-full ${isOverBudget ? 'bg-red-200' : ''}`}
                          />
                          <span className="ml-2 text-xs font-medium">
                            {Math.round(percentUsed)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteBudget(budget.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetsList;
