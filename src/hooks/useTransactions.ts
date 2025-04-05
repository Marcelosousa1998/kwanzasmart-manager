
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import * as FinanceService from "@/services/FinanceService";
import { Transaction } from "@/types/finance";

export const useTransactions = (
  dispatch: React.Dispatch<any>,
  userId?: string
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's transactions from Supabase
  const fetchTransactions = async () => {
    if (!userId) {
      console.error("No user ID available");
      toast({
        title: "Erro ao carregar transações",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }
    
    try {
      dispatch({ type: "SET_LOADING", loading: true });
      console.log("Fetching transactions for user:", userId);
      const transactions = await FinanceService.fetchTransactions(userId);
      dispatch({ type: "SET_TRANSACTIONS", transactions });
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      dispatch({ type: "SET_ERROR", error: error.message });
      toast({
        title: "Erro ao carregar transações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  // Action creators
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!userId) {
      console.error("No user ID available");
      toast({
        title: "Erro ao adicionar transação",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      dispatch({ type: "SET_LOADING", loading: true });
      
      console.log("Adding transaction with userId:", userId);
      const newTransaction = await FinanceService.createTransaction(transaction, userId);
      
      dispatch({ type: "ADD_TRANSACTION", transaction: newTransaction });
      
      toast({
        title: "Transação adicionada",
        description: "A transação foi adicionada com sucesso",
      });
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      dispatch({ type: "SET_ERROR", error: error.message });
      toast({
        title: "Erro ao adicionar transação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    if (!userId) {
      console.error("No user ID available");
      toast({
        title: "Erro ao atualizar transação",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      dispatch({ type: "SET_LOADING", loading: true });
      await FinanceService.updateTransaction(transaction, userId);
      dispatch({ type: "UPDATE_TRANSACTION", transaction });
      
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso",
      });
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      dispatch({ type: "SET_ERROR", error: error.message });
      toast({
        title: "Erro ao atualizar transação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!userId) {
      console.error("No user ID available");
      toast({
        title: "Erro ao excluir transação",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      dispatch({ type: "SET_LOADING", loading: true });
      await FinanceService.deleteTransaction(id, userId);
      dispatch({ type: "DELETE_TRANSACTION", id });
      
      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso",
      });
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      dispatch({ type: "SET_ERROR", error: error.message });
      toast({
        title: "Erro ao excluir transação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  return {
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading
  };
};
