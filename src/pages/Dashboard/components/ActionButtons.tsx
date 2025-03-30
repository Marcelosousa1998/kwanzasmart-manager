
import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "@/components/TransactionForm";

const ActionButtons = () => {
  const [openTransactionDialog, setOpenTransactionDialog] = React.useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog open={openTransactionDialog} onOpenChange={setOpenTransactionDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Nova Transação</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogDescription>
              Registre uma nova receita ou despesa em sua conta.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm onSuccess={() => setOpenTransactionDialog(false)} />
        </DialogContent>
      </Dialog>

      <Button variant="outline" className="flex items-center gap-2" asChild>
        <Link to="/transactions">
          <History className="h-4 w-4" />
          <span>Ver Histórico</span>
        </Link>
      </Button>
    </div>
  );
};

export default ActionButtons;
