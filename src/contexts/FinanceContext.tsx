import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
import * as FinanceService from "@/services/FinanceService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { financeReducer, initialState } from "@/reducers/financeReducer";
import { 
  Transaction, 
  Budget, 
  Goal, 
  Debt, 
  TransactionCategory, 
  FinanceState,
  FinanceAction 
} from "@/types/finance";
import { 
  getTotalIncome, 
  getTotalExpenses, 
  getBalance, 
  formatCurrency 
} from "@/utils/financeUtils";

// Create context
interface FinanceContextType {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, "id" | "spent">) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addDebt: (debt: Omit<Debt, "id">) => void;
  updateDebt: (debt: Debt) => void;
  deleteDebt: (id: string) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  formatCurrency: (amount: number) => string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's transactions from Supabase
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: "SET_LOADING", loading: true });
      const transactions = await FinanceService.fetchTransactions();
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

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // Setup real-time subscription for transactions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:finance_records')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'finance_records',
        filter: `created_by=eq.${user.id}`
      }, () => {
        // Refetch data when changes occur
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Action creators
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) return;
    
    try {
      dispatch({ type: "SET_LOADING", loading: true });
      const newTransaction = await FinanceService.createTransaction(transaction, user.id);
      dispatch({ type: "ADD_TRANSACTION", transaction: newTransaction });
      
      toast({
        title: "Transação adicionada",
        description: "A transação foi adicionada com sucesso",
      });
      
      // Handle budget update if implementing that feature
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      dispatch({ type: "SET_ERROR", error: error.message });
      toast({
        title: "Erro ao adicionar transação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      dispatch({ type: "SET_LOADING", loading: true });
      await FinanceService.updateTransaction(transaction);
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
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      dispatch({ type: "SET_LOADING", loading: true });
      await FinanceService.deleteTransaction(id);
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
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  // Manter os métodos locais para orçamentos, metas e dívidas até que esses
  // recursos sejam implementados no Supabase
  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    dispatch({ type: "ADD_BUDGET", budget: newBudget });
  };

  const updateBudget = (budget: Budget) => {
    dispatch({ type: "UPDATE_BUDGET", budget });
  };

  const deleteBudget = (id: string) => {
    dispatch({ type: "DELETE_BUDGET", id });
  };

  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    dispatch({ type: "ADD_GOAL", goal: newGoal });
  };

  const updateGoal = (goal: Goal) => {
    dispatch({ type: "UPDATE_GOAL", goal });
  };

  const deleteGoal = (id: string) => {
    dispatch({ type: "DELETE_GOAL", id });
  };

  const addDebt = (debt: Omit<Debt, "id">) => {
    const newDebt = {
      ...debt,
      id: Date.now().toString(),
    };
    dispatch({ type: "ADD_DEBT", debt: newDebt });
  };

  const updateDebt = (debt: Debt) => {
    dispatch({ type: "UPDATE_DEBT", debt });
  };

  const deleteDebt = (id: string) => {
    dispatch({ type: "DELETE_DEBT", id });
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        dispatch,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        addDebt,
        updateDebt,
        deleteDebt,
        getTotalIncome: () => getTotalIncome(state.transactions),
        getTotalExpenses: () => getTotalExpenses(state.transactions),
        getBalance: () => getBalance(state.transactions),
        formatCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

// For backward compatibility, export the types from here as well
export type { TransactionCategory, Transaction, Budget, Goal, Debt };
