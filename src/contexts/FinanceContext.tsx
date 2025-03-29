
import React, { createContext, useContext, useReducer, useEffect } from "react";

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
}

type FinanceAction =
  | { type: "ADD_TRANSACTION"; transaction: Transaction }
  | { type: "UPDATE_TRANSACTION"; transaction: Transaction }
  | { type: "DELETE_TRANSACTION"; id: string }
  | { type: "ADD_BUDGET"; budget: Budget }
  | { type: "UPDATE_BUDGET"; budget: Budget }
  | { type: "DELETE_BUDGET"; id: string }
  | { type: "ADD_GOAL"; goal: Goal }
  | { type: "UPDATE_GOAL"; goal: Goal }
  | { type: "DELETE_GOAL"; id: string }
  | { type: "ADD_DEBT"; debt: Debt }
  | { type: "UPDATE_DEBT"; debt: Debt }
  | { type: "DELETE_DEBT"; id: string }
  | { type: "SET_STATE"; state: FinanceState };

// Initial state with sample data
const initialState: FinanceState = {
  transactions: [],
  budgets: [],
  goals: [],
  debts: [],
  currency: "Kz",
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, action.transaction],
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
    case "SET_STATE":
      return action.state;
    default:
      return state;
  }
};

// Create context
interface FinanceContextType {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
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

// Sample data for testing
const createSampleData = (): FinanceState => {
  return {
    transactions: [
      {
        id: "1",
        amount: 250000,
        description: "Salário",
        category: "income",
        date: new Date(2023, 7, 1).toISOString(),
        isExpense: false,
      },
      {
        id: "2",
        amount: 40000,
        description: "Supermercado",
        category: "food",
        date: new Date(2023, 7, 5).toISOString(),
        isExpense: true,
      },
      {
        id: "3",
        amount: 15000,
        description: "Transporte",
        category: "transportation",
        date: new Date(2023, 7, 8).toISOString(),
        isExpense: true,
      },
      {
        id: "4",
        amount: 60000,
        description: "Aluguel",
        category: "housing",
        date: new Date(2023, 7, 10).toISOString(),
        isExpense: true,
      },
      {
        id: "5",
        amount: 25000,
        description: "Freelance",
        category: "income",
        date: new Date(2023, 7, 15).toISOString(),
        isExpense: false,
      },
    ],
    budgets: [
      {
        id: "1",
        category: "food",
        amount: 50000,
        spent: 40000,
        period: "monthly",
      },
      {
        id: "2",
        category: "transportation",
        amount: 25000,
        spent: 15000,
        period: "monthly",
      },
      {
        id: "3",
        category: "housing",
        amount: 60000,
        spent: 60000,
        period: "monthly",
      },
    ],
    goals: [
      {
        id: "1",
        name: "Fundo de emergência",
        targetAmount: 150000,
        currentAmount: 50000,
        targetDate: new Date(2023, 11, 31).toISOString(),
      },
      {
        id: "2",
        name: "Férias",
        targetAmount: 100000,
        currentAmount: 30000,
        targetDate: new Date(2024, 5, 30).toISOString(),
      },
    ],
    debts: [
      {
        id: "1",
        name: "Empréstimo Pessoal",
        amount: 200000,
        interestRate: 15,
        minimumPayment: 20000,
        remainingPayments: 10,
      },
    ],
    currency: "Kz",
  };
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem("financeData");
    
    if (savedState) {
      try {
        dispatch({ type: "SET_STATE", state: JSON.parse(savedState) });
      } catch (e) {
        console.error("Error loading saved finance data", e);
        // If there's an error loading saved data, use sample data
        dispatch({ type: "SET_STATE", state: createSampleData() });
      }
    } else {
      // If no saved data, use sample data
      dispatch({ type: "SET_STATE", state: createSampleData() });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("financeData", JSON.stringify(state));
  }, [state]);

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
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    dispatch({ type: "ADD_TRANSACTION", transaction: newTransaction });
    
    // Update budget spent amount if this is an expense
    if (transaction.isExpense) {
      const relevantBudget = state.budgets.find(b => b.category === transaction.category);
      if (relevantBudget) {
        const updatedBudget = {
          ...relevantBudget,
          spent: relevantBudget.spent + transaction.amount
        };
        dispatch({ type: "UPDATE_BUDGET", budget: updatedBudget });
      }
    }
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: "DELETE_TRANSACTION", id });
  };

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
