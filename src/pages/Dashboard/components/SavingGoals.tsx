
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFinance } from "@/contexts/FinanceContext";

const SavingGoals = () => {
  const { state, formatCurrency } = useFinance();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metas de Poupança</CardTitle>
        <CardDescription>
          Progresso das suas metas financeiras
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.goals.length === 0 ? (
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">
              Você ainda não tem metas definidas.
            </p>
            <Button asChild>
              <Link to="/goals">Criar Meta</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {state.goals.slice(0, 3).map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress value={progress} />
                  <p className="text-xs text-muted-foreground">
                    Meta para {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              );
            })}
            {state.goals.length > 3 && (
              <div className="text-center">
                <Button variant="link" asChild>
                  <Link to="/goals">Ver todas as metas</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingGoals;
