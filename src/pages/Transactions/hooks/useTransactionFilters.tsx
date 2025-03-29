
import { useState } from "react";
import { TransactionCategory } from "@/types/finance";

export function useTransactionFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortOrder,
    setSortOrder,
    sortField,
    setSortField,
    filterType,
    setFilterType
  };
}
