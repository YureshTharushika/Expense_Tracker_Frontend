import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense.model';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { Budget } from '../models/budget.model';
import { BudgetService } from '../services/budget.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
logout() {
throw new Error('Method not implemented.');
}
  expenses: Expense[] = [];
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  totalExpenses: number = 0;
  budgets: Budget[] = [];
  loggedInUserEmail: string = "";

  constructor(
    private expenseService: ExpenseService,
    private accountService: AccountService,
    private budgetService: BudgetService,
    private authService: AuthService,
    private router: Router
    ) {}

    ngOnInit(): void {
      this.loadAccounts();
      this.fetechUser();
      
    }

    loadAccounts(): void {
      this.accountService.getAccounts().subscribe(accounts => {
        this.accounts = accounts;
        if (accounts.length > 0) {
          this.loadSelectedAccount();
        }
      });
    }

    fetechUser(): void{
      this.authService.getUserInfo().subscribe(
        (userInfo: any) => {
          this.loggedInUserEmail = userInfo.email; 
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    }

    loadSelectedAccount(): void {
      const storedAccountId = localStorage.getItem('selectedAccountId');
      if (storedAccountId) {
        this.selectedAccount = this.accounts.find(account => account.id === +storedAccountId) || this.accounts[0];
        this.loadExpenses(this.selectedAccount.id);
        this.loadBudgets();
      } else if (this.accounts.length > 0) {
        this.selectedAccount = this.accounts[0];
        this.loadExpenses(this.selectedAccount.id);
        this.loadBudgets();
      }
    }

    loadExpenses(accountId: number): void {
      this.expenseService.getExpensesByAccount(accountId).subscribe(expenses => {
        this.expenses = expenses.slice(0, 10); // Get the last 10 expenses
        this.totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      });
    }

    loadBudgets(): void {
      if (this.selectedAccount) {
        this.budgetService.getBudgetsByAccount(this.selectedAccount.id).subscribe(budgets => {
          this.budgets = budgets;
        });
      }
    }

    createAccount(): void {
      this.router.navigate(['/accounts']);
    }

    createExpense(): void {
      this.router.navigate(['/expenses']);
    }
  
    createBudget(): void {
      this.router.navigate(['/budgets']);
    }

    viewBudget(id: number): void {
      this.router.navigate(['/budgets', id]);
    }

    getBudgetExpenditurePercentage(budget: Budget): number {
      const totalExpenses = this.expenses
        .filter(expense => expense.budgetId === budget.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return totalExpenses && budget.allocatedAmount ? (totalExpenses / budget.allocatedAmount) * 100 : 0;
    }
  
    getProgressBarColor(budget: Budget): string {
      const percentage = this.getBudgetExpenditurePercentage(budget);
      if (percentage <= 50) {
        return '#16a34a'; // Green 600
      } else if (percentage <= 75) {
        return '#facc15'; // Yellow 500
      } else {
        return '#dc2626'; // Red 600
      }
    }

}
