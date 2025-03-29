
import { useState, createContext, useContext } from "react";

interface GoalDialogsContextType {
  openAddDialog: boolean;
  setOpenAddDialog: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  goalToDelete: string | null;
  setGoalToDelete: (id: string | null) => void;
  contributionDialogOpen: boolean;
  setContributionDialogOpen: (open: boolean) => void;
  selectedGoal: string | null;
  setSelectedGoal: (id: string | null) => void;
  handleConfirmDelete: (id: string) => void;
  handleContribution: (goalId: string) => void;
}

const GoalDialogsContext = createContext<GoalDialogsContextType | undefined>(undefined);

export const GoalDialogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleConfirmDelete = (id: string) => {
    setGoalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleContribution = (goalId: string) => {
    setSelectedGoal(goalId);
    setContributionAmount("");
    setContributionDialogOpen(true);
  };

  return (
    <GoalDialogsContext.Provider
      value={{
        openAddDialog,
        setOpenAddDialog,
        deleteDialogOpen,
        setDeleteDialogOpen,
        goalToDelete,
        setGoalToDelete,
        contributionDialogOpen,
        setContributionDialogOpen,
        selectedGoal,
        setSelectedGoal,
        handleConfirmDelete,
        handleContribution,
      }}
    >
      {children}
    </GoalDialogsContext.Provider>
  );
};

// For internal use only - fixes the circular import issue
let setContributionAmount = (value: string) => {};
export const setContributionAmountExport = (setter: (value: string) => void) => {
  setContributionAmount = setter;
};

export const useGoalDialogs = () => {
  const context = useContext(GoalDialogsContext);
  if (!context) {
    throw new Error("useGoalDialogs must be used within a GoalDialogsProvider");
  }
  return context;
};
