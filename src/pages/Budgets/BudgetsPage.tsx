
import React from "react";
import Layout from "@/components/Layout";
import BudgetsSummary from "./components/BudgetsSummary";
import BudgetsList from "./components/BudgetsList";
import BudgetsTips from "./components/BudgetsTips";
import AddBudgetDialog from "./components/AddBudgetDialog";
import DeleteBudgetDialog from "./components/DeleteBudgetDialog";
import { useBudgetDialogs } from "./hooks/useBudgetDialogs";

const BudgetsPage = () => {
  const { 
    openAddDialog, 
    setOpenAddDialog, 
    deleteDialogOpen, 
    setDeleteDialogOpen,
    budgetToDelete,
    setBudgetToDelete,
    handleConfirmDelete
  } = useBudgetDialogs();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
          <AddBudgetDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
        </div>

        <BudgetsSummary />
        <BudgetsList onDeleteBudget={handleConfirmDelete} />
        <BudgetsTips />

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
