import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense.model';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  expenses: Expense[] = [];
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  totalExpenses: number = 0;

  constructor(
    private expenseService: ExpenseService,
    private accountService: AccountService,
    private router: Router
    ) {}

    ngOnInit(): void {
      this.loadAccounts();
    }

    loadAccounts(): void {
      this.accountService.getAccounts().subscribe(accounts => {
        this.accounts = accounts;
        if (accounts.length > 0) {
          this.loadSelectedAccount();
        }
      });
    }

    loadSelectedAccount(): void {
      const storedAccountId = localStorage.getItem('selectedAccountId');
      if (storedAccountId) {
        this.selectedAccount = this.accounts.find(account => account.id === +storedAccountId) || this.accounts[0];
        this.loadExpenses(this.selectedAccount.id);
      } else if (this.accounts.length > 0) {
        this.selectedAccount = this.accounts[0];
        this.loadExpenses(this.selectedAccount.id);
      }
    }

    loadExpenses(accountId: number): void {
      this.expenseService.getExpensesByAccount(accountId).subscribe(expenses => {
        this.expenses = expenses.slice(0, 10); // Get the last 10 expenses
        this.totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      });
    }

    createAccount(): void {
      this.router.navigate(['/accounts']);
    }

}
