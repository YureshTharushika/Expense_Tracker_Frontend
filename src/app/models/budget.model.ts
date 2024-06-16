import { Expense } from "./expense.model";

export interface Budget {
    id: number;
    name: string;
    allocatedAmount: number;
    accountId: number;
    expenses?: Expense[];
  }
  