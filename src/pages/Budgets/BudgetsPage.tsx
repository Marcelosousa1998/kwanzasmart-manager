
import React from "react";
import Layout from "@/components/Layout";
import BudgetsSummary from "./components/BudgetsSummary";
import BudgetsList from "./components/BudgetsList";
import BudgetsTips from "./components/BudgetsTips";
import AddBudgetDialog from "./components/AddBudgetDialog";
import DeleteBudgetDialog from "./components/DeleteBudgetDialog";
import { useBudgetDialogs } from "./hooks/useBudgetDialogs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const BudgetsPage = () => {
  const { 
    openAddDialog, 
    setOpenAddDialog, 
    deleteDialogOpen, 
    setDeleteDialogOpen,
    budgetToDelete,
    setBudgetToDelete,
    handleOpenAddDialog,
    handleConfirmDelete
  } = useBudgetDialogs();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
          <Button onClick={handleOpenAddDialog} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Novo Orçamento
          </Button>
        </div>

        <BudgetsSummary />
        <BudgetsList onDeleteBudget={handleConfirmDelete} />
        <BudgetsTips />

        <AddBudgetDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
        <DeleteBudgetDialog 
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          budgetId={budgetToDelete}
        />
      </div>
    </Layout>
  );
};

export default BudgetsPage;
