
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFinance, TransactionCategory } from "@/contexts/FinanceContext";
import { getCategoryLabel, expenseCategories } from "@/utils/categoryUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  onSuccess?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const { addTransaction, formatCurrency } = useFinance();
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("food");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }

    if (!description) {
      toast({
        title: "Descrição necessária",
        description: "Por favor, adicione uma descrição para a transação",
        variant: "destructive",
      });
      return;
    }

    const transaction = {
      amount: parseFloat(amount),
      description,
      category: transactionType === "income" ? "income" as TransactionCategory : category,
      date: new Date().toISOString(),
      isExpense: transactionType === "expense",
    };

    addTransaction(transaction);
    
    toast({
      title: "Transação adicionada",
      description: `${transactionType === "income" ? "Receita" : "Despesa"} de ${formatCurrency(parseFloat(amount))} registrada com sucesso.`,
    });

    // Reset form
    setAmount("");
    setDescription("");
    setCategory("food");
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs 
        defaultValue="expense" 
        onValueChange={(v) => setTransactionType(v as "income" | "expense")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Despesa</TabsTrigger>
          <TabsTrigger value="income">Receita</TabsTrigger>
        </TabsList>
        <TabsContent value="expense" className="space-y-4 pt-4">
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Compras no supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as TransactionCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        <TabsContent value="income" className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="amount-income">Valor (Kz)</Label>
            <Input
              id="amount-income"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description-income">Descrição</Label>
            <Input
              id="description-income"
              placeholder="Ex: Salário"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </TabsContent>
      </Tabs>
      <Button type="submit" className={cn(
        "w-full",
        transactionType === "income" ? "bg-green-600 hover:bg-green-700" : ""
      )}>
        Adicionar {transactionType === "income" ? "Receita" : "Despesa"}
      </Button>
    </form>
  );
};

export default TransactionForm;
