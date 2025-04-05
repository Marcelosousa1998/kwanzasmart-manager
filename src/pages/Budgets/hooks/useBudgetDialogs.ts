
import { useState } from "react";

export const useBudgetDialogs = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleConfirmDelete = (id: string) => {
    setBudgetToDelete(id);
    setDeleteDialogOpen(true);
  };

  return {
    openAddDialog,
    setOpenAddDialog,
    deleteDialogOpen,
    setDeleteDialogOpen,
    budgetToDelete,
    setBudgetToDelete,
    handleOpenAddDialog,
    handleConfirmDelete,
  };
};
