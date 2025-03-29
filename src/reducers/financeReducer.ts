
import { FinanceAction, FinanceState } from "@/types/finance";

// Initial state
export const initialState: FinanceState = {
  transactions: [],
  budgets: [],
  goals: [],
  debts: [],
  currency: "Kz",
  loading: false,
  error: null,
};

export const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.transactions,
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.transaction, ...state.transactions],
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.transaction.id ? action.transaction : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.id),
      };
    case "SET_BUDGETS":
      return {
        ...state,
        budgets: action.budgets,
      };
    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [...state.budgets, action.budget],
      };
    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.id === action.budget.id ? action.budget : b
        ),
      };
    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.id),
      };
    case "SET_GOALS":
      return {
        ...state,
        goals: action.goals,
      };
    case "ADD_GOAL":
      return {
        ...state,
        goals: [...state.goals, action.goal],
      };
    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.goal.id ? action.goal : g
        ),
      };
    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.id),
      };
    case "SET_DEBTS":
      return {
        ...state,
        debts: action.debts,
      };
    case "ADD_DEBT":
      return {
        ...state,
        debts: [...state.debts, action.debt],
      };
    case "UPDATE_DEBT":
      return {
        ...state,
        debts: state.debts.map((d) =>
          d.id === action.debt.id ? action.debt : d
        ),
      };
    case "DELETE_DEBT":
      return {
        ...state,
        debts: state.debts.filter((d) => d.id !== action.id),
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};
