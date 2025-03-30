
import React, { useState, useEffect } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import Layout from "@/components/Layout";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import TransactionsList from "./components/TransactionsList";
import TransactionFilters from "./components/TransactionFilters";
import AddTransactionDialog from "./components/AddTransactionDialog";

const TransactionsPage = () => {
  const { deleteTransaction, fetchTransactions } = useFinance();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  // Buscar transações quando a página for carregada
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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
          <AddTransactionDialog 
            open={openAddDialog} 
            onOpenChange={setOpenAddDialog} 
          />
        </div>

        {/* Filters and Search */}
        <TransactionFilters />

        {/* Transactions List */}
        <TransactionsList onDelete={handleConfirmDelete} />

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
      </div>
    </Layout>
  );
};

export default TransactionsPage;
