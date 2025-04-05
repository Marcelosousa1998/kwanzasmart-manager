
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useFinance, TransactionCategory } from "@/contexts/FinanceContext";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoryLabel, expenseCategories } from "@/utils/categoryUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddBudgetDialog = ({ open, onOpenChange }: AddBudgetDialogProps) => {
  const { state, addBudget, formatCurrency } = useFinance();
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState<TransactionCategory>("food");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly");

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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button id="add-budget-trigger" className="flex items-center gap-2">
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
  );
};

export default AddBudgetDialog;
