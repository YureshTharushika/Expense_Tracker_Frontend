import { Account } from "./account.model";
import { Budget } from "./budget.model";

export interface Expense {
    id: number;
    description: string;
    amount: number;
    date: string;
    accountId: number;
    account: Account;
    budgetId?: number;
    budget: Budget

    
  }