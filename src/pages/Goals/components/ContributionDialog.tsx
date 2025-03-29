
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoalDialogs } from "../hooks/useGoalDialogs";
import { useContribution } from "../hooks/useContribution";

const ContributionDialog = () => {
  const { contributionDialogOpen, setContributionDialogOpen, selectedGoal } = useGoalDialogs();
  const { contributionAmount, setContributionAmount, handleAddContribution } = useContribution();

  return (
    <Dialog open={contributionDialogOpen} onOpenChange={setContributionDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Contribuição</DialogTitle>
          <DialogDescription>
            Adicione um valor à sua meta de poupança.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="contribution">Valor (Kz)</Label>
            <Input
              id="contribution"
              type="number"
              placeholder="0"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => handleAddContribution(selectedGoal)}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContributionDialog;
