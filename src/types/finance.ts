
// Finance related types for the application

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

export interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  currency: string;
  loading: boolean;
  error: string | null;
}

export type FinanceAction =
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
