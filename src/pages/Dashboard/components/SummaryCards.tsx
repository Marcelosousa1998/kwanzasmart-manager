
import React from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";

const SummaryCards = () => {
  const { getBalance, getTotalIncome, getTotalExpenses, formatCurrency } = useFinance();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(getBalance())}</div>
          <p className="text-xs text-muted-foreground">
            Atualizado em {new Date().toLocaleDateString('pt-BR')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(getTotalIncome())}</div>
          <p className="text-xs text-muted-foreground">
            Total de receitas registradas
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(getTotalExpenses())}</div>
          <p className="text-xs text-muted-foreground">
            Total de despesas registradas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
