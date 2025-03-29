
import React, { useState } from "react";
import { Calendar, PlusCircle, Target, Trash2, Check } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Goals = () => {
  const { state, addGoal, updateGoal, deleteGoal, formatCurrency } = useFinance();
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Nome necessário",
        description: "Por favor, adicione um nome para sua meta",
        variant: "destructive",
      });
      return;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor alvo válido",
        variant: "destructive",
      });
      return;
    }

    if (!targetDate) {
      toast({
        title: "Data necessária",
        description: "Por favor, selecione uma data alvo para sua meta",
        variant: "destructive",
      });
      return;
    }

    const initialAmount = currentAmount ? parseFloat(currentAmount) : 0;
    
    if (initialAmount > parseFloat(targetAmount)) {
      toast({
        title: "Valor inicial inválido",
        description: "O valor inicial não pode ser maior que o valor alvo",
        variant: "destructive",
      });
      return;
    }

    const newGoal = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: initialAmount,
      targetDate,
    };

    addGoal(newGoal);
    
    toast({
      title: "Meta criada",
      description: `Meta de ${formatCurrency(parseFloat(targetAmount))} para "${name}" foi criada.`,
    });

    // Reset form
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
    setOpenAddDialog(false);
  };

  const handleConfirmDelete = (id: string) => {
    setGoalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete);
      setDeleteDialogOpen(false);
      toast({
        title: "Meta removida",
        description: "A meta foi removida com sucesso",
      });
    }
  };

  const handleContribution = (goalId: string) => {
    setSelectedGoal(goalId);
    setContributionAmount("");
    setContributionDialogOpen(true);
  };

  const handleAddContribution = () => {
    if (!selectedGoal) return;
    
    const amount = parseFloat(contributionAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }
    
    const goal = state.goals.find(g => g.id === selectedGoal);
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

  const calculateMonthlyContribution = (goal: typeof state.goals[0]) => {
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Metas de Poupança</h1>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Nova Meta de Poupança</DialogTitle>
                  <DialogDescription>
                    Defina uma meta financeira para acompanhar seu progresso.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Meta</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Fundo de emergência"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Valor Alvo (Kz)</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      placeholder="0"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentAmount">Valor Inicial (opcional)</Label>
                    <Input
                      id="currentAmount"
                      type="number"
                      placeholder="0"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetDate">Data Alvo</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Criar Meta</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Grid */}
        {state.goals.length === 0 ? (
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
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state.goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const isCompleted = progress >= 100;
              const daysRemaining = calculateDaysRemaining(goal.targetDate);
              const monthlyContribution = calculateMonthlyContribution(goal);
              
              return (
                <Card key={goal.id} className="relative">
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
            })}
          </div>
        )}

        {/* Tips Card */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas para Poupar</CardTitle>
            <CardDescription>
              Estratégias para alcançar suas metas financeiras
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Regra dos 72h</h3>
              <p className="text-sm text-muted-foreground">
                Espere 72 horas antes de fazer compras não essenciais. Isso ajuda a evitar 
                compras por impulso e dá tempo para refletir se realmente necessita do item.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Automatize sua poupança</h3>
              <p className="text-sm text-muted-foreground">
                Defina transferências automáticas para sua conta poupança logo após receber 
                seu salário, para garantir que você poupe antes de gastar.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Método 30-30-30-10</h3>
              <p className="text-sm text-muted-foreground">
                Distribua seu salário: 30% para habitação, 30% para necessidades, 30% para objetivos
                financeiros e 10% para lazer. Adapte essas percentagens conforme sua realidade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta meta? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contribution Dialog */}
      <Dialog open={contributionDialogOpen} onOpenChange={setContributionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Contribuição</DialogTitle>
            <DialogDescription>
              Adicione um valor à sua meta de poupança.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contribution">Valor (Kz)</Label>
              <Input
                id="contribution"
                type="number"
                placeholder="0"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddContribution}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Goals;
