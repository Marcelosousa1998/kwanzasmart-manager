
import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";

export const useAddGoal = (onSuccess: () => void) => {
  const { addGoal, formatCurrency } = useFinance();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

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
    onSuccess();
  };

  return {
    name,
    setName,
    targetAmount,
    setTargetAmount,
    currentAmount,
    setCurrentAmount,
    targetDate,
    setTargetDate,
    handleSubmit
  };
};
