import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import * as FinanceService from "@/services/FinanceService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Types
export type TransactionCategory = 
  | "income" 
  | "housing" 
  | "food" 
  | "transportation" 
  | "education" 
  | "entertainment" 
  | "utilities" 
  | "healthcare" 
  | "shopping" 
  | "savings" 
  | "debt" 
  | "remittances"
  | "other";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  date: string;
  isExpense: boolean;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  amount: number;
  spent: number;
  period: "monthly" | "weekly";
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  minimumPayment: number;
  remainingPayments: number;
}

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  currency: string;
  loading: boolean;
  error: string | null;
}

type FinanceAction =
  | { type: "SET_TRANSACTIONS"; transactions: Transaction[] }
  | { type: "ADD_TRANSACTION"; transaction: Transaction }
  | { type: "UPDATE_TRANSACTION"; transaction: Transaction }
  | { type: "DELETE_TRANSACTION"; id: string }
  | { type: "SET_BUDGETS"; budgets: Budget[] }
  | { type: "ADD_BUDGET"; budget: Budget }
  | { type: "UPDATE_BUDGET"; budget: Budget }
  | { type: "DELETE_BUDGET"; id: string }
  | { type: "SET_GOALS"; goals: Goal[] }
  | { type: "ADD_GOAL"; goal: Goal }
  | { type: "UPDATE_GOAL"; goal: Goal }
  | { type: "DELETE_GOAL"; id: string }
  | { type: "SET_DEBTS"; debts: Debt[] }
  | { type: "ADD_DEBT"; debt: Debt }
  | { type: "UPDATE_DEBT"; debt: Debt }
  | { type: "DELETE_DEBT"; id: string }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null };

// Initial state
const initialState: FinanceState = {
  transactions: [],
  budgets: [],
  goals: [],
  debts: [],
  currency: "Kz",
  loading: false,
  error: null,
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.transactions,
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.transaction, ...state.transactions],
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.transaction.id ? action.transaction : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.id),
      };
    case "SET_BUDGETS":
      return {
        ...state,
        budgets: action.budgets,
      };
    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [...state.budgets, action.budget],
      };
    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.id === action.budget.id ? action.budget : b
        ),
      };
    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.id),
      };
    case "SET_GOALS":
      return {
        ...state,
        goals: action.goals,
      };
    case "ADD_GOAL":
      return {
        ...state,
        goals: [...state.goals, action.goal],
      };
    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.goal.id ? action.goal : g
        ),
      };
    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.id),
      };
    case "SET_DEBTS":
      return {
        ...state,
        debts: action.debts,
      };
    case "ADD_DEBT":
      return {
        ...state,
        debts: [...state.debts, action.debt],
      };
    case "UPDATE_DEBT":
      return {
        ...state,
        debts: state.debts.map((d) =>
          d.id === action.debt.id ? action.debt : d
        ),
      };
    case "DELETE_DEBT":
      return {
        ...state,
        debts: state.debts.filter((d) => d.id !== action.id),
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

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

  // Helper functions
  const getTotalIncome = () => {
    return state.transactions
      .filter(t => !t.isExpense)
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return state.transactions
      .filter(t => t.isExpense)
      .reduce((total, t) => total + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
        getTotalIncome,
        getTotalExpenses,
        getBalance,
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
