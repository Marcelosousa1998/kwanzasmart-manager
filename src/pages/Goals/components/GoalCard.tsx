
import React from "react";
import { Calendar, Check, Target, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@/types/finance";
import { useFinance } from "@/contexts/FinanceContext";
import { useGoalDialogs } from "../hooks/useGoalDialogs";
import { useGoalCalculation } from "../hooks/useGoalCalculation";

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const { formatCurrency } = useFinance();
  const { handleConfirmDelete, handleContribution } = useGoalDialogs();
  const { calculateProgress, calculateDaysRemaining, calculateMonthlyContribution } = useGoalCalculation();
  
  const progress = calculateProgress(goal);
  const isCompleted = progress >= 100;
  const daysRemaining = calculateDaysRemaining(goal.targetDate);
  const monthlyContribution = calculateMonthlyContribution(goal);

  return (
    <Card className="relative">
      {isCompleted && (
        <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2">
          <Check className="h-4 w-4" />
        </div>
      )}
      <CardHeader>
        <CardTitle>{goal.name}</CardTitle>
        <CardDescription>
          Meta para {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Progresso</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className={isCompleted ? "bg-green-100" : ""} />
        </div>
        
        <div className="flex justify-between pt-2">
          <div>
            <p className="text-sm text-muted-foreground">Atual</p>
            <p className="text-lg font-medium">{formatCurrency(goal.currentAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Meta</p>
            <p className="text-lg font-medium">{formatCurrency(goal.targetAmount)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <Calendar className="h-4 w-4 text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Dias Restantes</p>
            <p className="text-sm font-medium">{daysRemaining > 0 ? daysRemaining : 0}</p>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <Target className="h-4 w-4 text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Mensal Sugerido</p>
            <p className="text-sm font-medium">{formatCurrency(monthlyContribution)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => handleContribution(goal.id)}
          disabled={isCompleted}
        >
          Adicionar
        </Button>
        <Button 
          variant="ghost" 
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => handleConfirmDelete(goal.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoalCard;
