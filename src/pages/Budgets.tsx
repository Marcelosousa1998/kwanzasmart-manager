
import React, { useState, useEffect } from "react";
import { Check, PlusCircle, Trash2, X } from "lucide-react";
import { useFinance, TransactionCategory } from "@/contexts/FinanceContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import CategoryIcon from "@/components/CategoryIcon";
import { getCategoryLabel, expenseCategories } from "@/utils/categoryUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Budgets = () => {
  const { state, addBudget, deleteBudget, formatCurrency, isLoading, fetchTransactions } = useFinance();
  const { user } = useAuth();
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [category, setCategory] = useState<TransactionCategory>("food");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[160px]" />
            <Skeleton className="h-10 w-[150px] rounded-md" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
          </div>
          
          <Skeleton className="h-[350px] w-full rounded-lg" />
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
      </Layout>
    );
  }

  // Calculate total budgeted amount
  const totalBudgeted = state.budgets.reduce((total, budget) => total + budget.amount, 0);
  
  // Calculate total expenses amount
  const totalExpenses = state.transactions
    .filter(t => t.isExpense)
    .reduce((total, t) => total + t.amount, 0);
  
  // Calculate the remaining budget
  const remainingBudget = totalBudgeted - totalExpenses;

  // Check for categories without budgets
  const categoriesWithBudgets = state.budgets.map(b => b.category);
  const unbudgetedCategories = expenseCategories.filter(
    category => !categoriesWithBudgets.includes(category)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar um orçamento",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }

    // Check if budget for this category already exists
    if (state.budgets.some(b => b.category === category)) {
      toast({
        title: "Categoria já orçada",
        description: "Já existe um orçamento para esta categoria",
        variant: "destructive",
      });
      return;
    }

    const newBudget = {
      category,
      amount: parseFloat(amount),
      period,
    };

    addBudget(newBudget);
    
    toast({
      title: "Orçamento adicionado",
      description: `Orçamento de ${formatCurrency(parseFloat(amount))} para ${getCategoryLabel(category)} foi criado.`,
    });

    // Reset form
    setAmount("");
    setCategory("food");
    setPeriod("monthly");
    setOpenAddDialog(false);
  };

  const handleConfirmDelete = (id: string) => {
    setBudgetToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete);
      setDeleteDialogOpen(false);
      toast({
        title: "Orçamento removido",
        description: "O orçamento foi removido com sucesso",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Novo Orçamento</DialogTitle>
                  <DialogDescription>
                    Crie um orçamento para controlar seus gastos por categoria.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select 
                      value={category} 
                      onValueChange={(value) => setCategory(value as TransactionCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {unbudgetedCategories.length > 0 ? (
                          unbudgetedCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {getCategoryLabel(cat)}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="none">
                            Todas as categorias já têm orçamentos
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (Kz)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Período</Label>
                    <RadioGroup 
                      defaultValue="monthly" 
                      value={period} 
                      onValueChange={(value) => setPeriod(value as "monthly" | "weekly")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Mensal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Semanal</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={!user || unbudgetedCategories.length === 0}>
                    Criar Orçamento
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Budget Summary */}
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

        {/* Budget List */}
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
                <Button onClick={() => setOpenAddDialog(true)}>
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
                              onClick={() => handleConfirmDelete(budget.id)}
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
        
        {/* Budget Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas de Orçamento</CardTitle>
            <CardDescription>
              Regra 50/30/20 adaptada para Angola
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A regra 50/30/20 é uma estratégia popular de orçamento que aloca seu rendimento em três categorias:
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-medium">60% - Necessidades</span>
                </div>
                <Progress value={60} className="w-32 h-2" />
              </div>
              <p className="text-xs text-muted-foreground pl-5">
                Despesas essenciais como aluguel, alimentação, transporte, educação básica
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="font-medium">20% - Desejos</span>
                </div>
                <Progress value={20} className="w-32 h-2" />
              </div>
              <p className="text-xs text-muted-foreground pl-5">
                Gastos não essenciais como entretenimento, jantar fora, compras
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-medium">20% - Poupança e Dívidas</span>
                </div>
                <Progress value={20} className="w-32 h-2" />
              </div>
              <p className="text-xs text-muted-foreground pl-5">
                Poupança para emergências, metas futuras e pagamento de dívidas
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <p className="text-sm">
              <strong>Nota:</strong> Esta regra foi adaptada à realidade angolana, onde os custos de necessidades
              básicas geralmente representam uma parcela maior do rendimento.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? 
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
    </Layout>
  );
};

export default Budgets;
