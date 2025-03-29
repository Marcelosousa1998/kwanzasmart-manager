
import { useFinance } from "@/contexts/FinanceContext";
import { useTransactionFilters } from "./useTransactionFilters";

export function useFilteredTransactions() {
  const { state } = useFinance();
  const {
    searchQuery,
    selectedCategory,
    filterType,
    sortField,
    sortOrder
  } = useTransactionFilters();

  // Filter and sort transactions
  const filteredTransactions = state.transactions.filter((transaction) => {
    // Filter by search query (description)
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === null || transaction.category === selectedCategory;
    
    // Filter by type (income/expense)
    const matchesType = 
      filterType === "all" || 
      (filterType === "expense" && transaction.isExpense) || 
      (filterType === "income" && !transaction.isExpense);
    
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    // Sort by date or amount
    if (sortField === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  return filteredTransactions;
}
