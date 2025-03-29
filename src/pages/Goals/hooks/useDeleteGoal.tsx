
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { useGoalDialogs } from "./useGoalDialogs";

export const useDeleteGoal = () => {
  const { deleteGoal } = useFinance();
  const { toast } = useToast();
  const { setDeleteDialogOpen } = useGoalDialogs();

  const handleDelete = (goalToDelete: string | null) => {
    if (goalToDelete) {
      deleteGoal(goalToDelete);
      setDeleteDialogOpen(false);
      toast({
        title: "Meta removida",
        description: "A meta foi removida com sucesso",
      });
    }
  };

  return { handleDelete };
};
