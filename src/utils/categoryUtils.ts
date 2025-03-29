
import { TransactionCategory } from "@/contexts/FinanceContext";

export const getCategoryLabel = (category: TransactionCategory): string => {
  const categoryMap: Record<TransactionCategory, string> = {
    income: "Receita",
    housing: "Habitação",
    food: "Alimentação",
    transportation: "Transporte",
    education: "Educação",
    entertainment: "Entretenimento",
    utilities: "Serviços",
    healthcare: "Saúde",
    shopping: "Compras",
    savings: "Poupança",
    debt: "Dívidas",
    remittances: "Remessas",
    other: "Outros",
  };

  return categoryMap[category] || "Desconhecido";
};

export const getCategoryColor = (category: TransactionCategory): string => {
  const colorMap: Record<TransactionCategory, string> = {
    income: "bg-green-500",
    housing: "bg-blue-500",
    food: "bg-orange-500",
    transportation: "bg-violet-500",
    education: "bg-cyan-500",
    entertainment: "bg-pink-500",
    utilities: "bg-indigo-500",
    healthcare: "bg-red-500",
    shopping: "bg-amber-500",
    savings: "bg-emerald-500",
    debt: "bg-rose-500",
    remittances: "bg-purple-500",
    other: "bg-gray-500",
  };

  return colorMap[category] || "bg-gray-500";
};

export const expenseCategories: TransactionCategory[] = [
  "housing",
  "food",
  "transportation",
  "education",
  "entertainment",
  "utilities",
  "healthcare",
  "shopping",
  "savings",
  "debt",
  "remittances",
  "other",
];

export const allCategories: TransactionCategory[] = [
  "income",
  ...expenseCategories,
];
