
import { Transaction } from "@/types/finance";

// Helper functions for finance-related calculations and formatting
export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => !t.isExpense)
    .reduce((total, t) => total + t.amount, 0);
};

export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.isExpense)
    .reduce((total, t) => total + t.amount, 0);
};

export const getBalance = (transactions: Transaction[]): number => {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 0,
  }).format(amount);
};
