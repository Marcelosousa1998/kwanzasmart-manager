
import { Debt } from "@/types/finance";

export const useDebts = (dispatch: React.Dispatch<any>) => {
  const addDebt = (debt: Omit<Debt, "id">) => {
    const newDebt = {
      ...debt,
      id: Date.now().toString(),
    };
    dispatch({ type: "ADD_DEBT", debt: newDebt });
  };

  const updateDebt = (debt: Debt) => {
    dispatch({ type: "UPDATE_DEBT", debt });
  };

  const deleteDebt = (id: string) => {
    dispatch({ type: "DELETE_DEBT", id });
  };

  return {
    addDebt,
    updateDebt,
    deleteDebt
  };
};
