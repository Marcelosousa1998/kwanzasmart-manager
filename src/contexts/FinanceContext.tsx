
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
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
import { useTransactions } from "@/hooks/useTransactions";
import { useBudgets } from "@/hooks/useBudgets";
import { useGoals } from "@/hooks/useGoals";
import { useDebts } from "@/hooks/useDebts";

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

  // Initialize hooks
  const transactions = useTransactions(dispatch, user?.id);
  const budgets = useBudgets(dispatch);
  const goals = useGoals(dispatch);
  const debts = useDebts(dispatch);

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      transactions.fetchTransactions();
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
        transactions.fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <FinanceContext.Provider
      value={{
        state,
        dispatch,
        fetchTransactions: transactions.fetchTransactions,
        addTransaction: transactions.addTransaction,
        updateTransaction: transactions.updateTransaction,
        deleteTransaction: transactions.deleteTransaction,
        addBudget: budgets.addBudget,
        updateBudget: budgets.updateBudget,
        deleteBudget: budgets.deleteBudget,
        addGoal: goals.addGoal,
        updateGoal: goals.updateGoal,
        deleteGoal: goals.deleteGoal,
        addDebt: debts.addDebt,
        updateDebt: debts.updateDebt,
        deleteDebt: debts.deleteDebt,
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
