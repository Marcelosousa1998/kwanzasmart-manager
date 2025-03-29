
import React from "react";
import { GoalDialogsProvider } from "../hooks/useGoalDialogs";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ContributionDialog from "./ContributionDialog";

interface GoalsWrapperProps {
  children: React.ReactNode;
}

const GoalsWrapper = ({ children }: GoalsWrapperProps) => {
  return (
    <GoalDialogsProvider>
      {children}
      <DeleteConfirmationDialog />
      <ContributionDialog />
    </GoalDialogsProvider>
  );
};

export default GoalsWrapper;
