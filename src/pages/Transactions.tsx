
import React, { useState } from "react";
import { 
  ArrowUpDown, 
  Calendar, 
  Filter, 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit 
} from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction, TransactionCategory } from "@/types/finance";
import Layout from "@/components/Layout";
import TransactionForm from "@/components/TransactionForm";
import CategoryIcon from "@/components/CategoryIcon";
import { getCategoryLabel, allCategories } from "@/utils/categoryUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Transactions = () => {
  const { state, deleteTransaction, formatCurrency } = useFinance();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

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

  const handleConfirmDelete = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Transação</DialogTitle>
                <DialogDescription>
                  Registre uma nova receita ou despesa em sua conta.
                </DialogDescription>
              </DialogHeader>
              <TransactionForm onSuccess={() => setOpenAddDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-base">Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>
            
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
            >
              <SelectTrigger className="h-9">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Categoria" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectLabel>Categorias</SelectLabel>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as "all" | "expense" | "income")}
            >
              <SelectTrigger className="h-9">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <SelectValue placeholder="Tipo" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="expense">Apenas Despesas</SelectItem>
                <SelectItem value="income">Apenas Receitas</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={`${sortField}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-");
                setSortField(field as "date" | "amount");
                setSortOrder(order as "asc" | "desc");
              }}
            >
              <SelectTrigger className="h-9">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="Ordenar por" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Data (mais recente)</SelectItem>
                <SelectItem value="date-asc">Data (mais antiga)</SelectItem>
                <SelectItem value="amount-desc">Valor (maior)</SelectItem>
                <SelectItem value="amount-asc">Valor (menor)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Transactions List */}
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
                                onClick={() => handleConfirmDelete(transaction.id)}
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
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Transactions;
