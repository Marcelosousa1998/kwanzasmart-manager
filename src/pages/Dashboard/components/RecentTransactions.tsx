
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import CategoryIcon from "@/components/CategoryIcon";
import { getCategoryColor } from "@/utils/categoryUtils";

const RecentTransactions = () => {
  const { state, formatCurrency } = useFinance();

  const recentTransactions = [...state.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>
          Suas últimas 5 transações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma transação registrada ainda.
            </p>
          ) : (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.isExpense ? 
                      getCategoryColor(transaction.category) : 
                      "bg-green-500"
                  }`}>
                    <CategoryIcon 
                      category={transaction.category} 
                      className="h-4 w-4 text-white" 
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  transaction.isExpense ? "text-red-500" : "text-green-500"
                }`}>
                  {transaction.isExpense ? "-" : "+"}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))
          )}
        </div>
        {recentTransactions.length > 0 && (
          <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <Link to="/transactions">Ver todas as transações</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
