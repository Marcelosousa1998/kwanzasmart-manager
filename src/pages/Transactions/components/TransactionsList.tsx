
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CategoryIcon from "@/components/CategoryIcon";
import { getCategoryLabel } from "@/utils/categoryUtils";
import { useFilteredTransactions } from "../hooks/useFilteredTransactions";
import { useFinance } from "@/contexts/FinanceContext";

interface TransactionsListProps {
  onDelete: (id: string) => void;
}

const TransactionsList = ({ onDelete }: TransactionsListProps) => {
  const { formatCurrency } = useFinance();
  const filteredTransactions = useFilteredTransactions();

  return (
    <Card>
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-base">Histórico de Transações</CardTitle>
        <CardDescription>
          {filteredTransactions.length} transações encontradas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-5 py-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-muted-foreground">Descrição</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                <th className="px-5 py-3 text-right text-sm font-medium text-muted-foreground">Valor</th>
                <th className="px-5 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-5 text-center text-muted-foreground">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-5 py-4 text-sm">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {transaction.description}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CategoryIcon 
                          category={transaction.category} 
                          className={cn(
                            "h-4 w-4", 
                            transaction.isExpense ? "text-red-500" : "text-green-500"
                          )} 
                        />
                        <span>
                          {transaction.isExpense 
                            ? getCategoryLabel(transaction.category)
                            : "Receita"}
                        </span>
                      </div>
                    </td>
                    <td className={cn(
                      "px-5 py-4 text-sm text-right font-medium",
                      transaction.isExpense ? "text-red-500" : "text-green-500"
                    )}>
                      {transaction.isExpense ? "-" : "+"}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center text-red-500 focus:text-red-500"
                            onClick={() => onDelete(transaction.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
