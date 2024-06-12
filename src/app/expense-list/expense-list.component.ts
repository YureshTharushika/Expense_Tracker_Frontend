import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { Expense } from '../models/expense.model';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {

  expenses: Expense[] = [];
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  isAddExpenseModalOpen = false;
  expenseForm: FormGroup;
  faPlusCircle = faPlusCircle;
  faTrash = faTrash;

  constructor(
    private expenseService: ExpenseService, 
    private accountService: AccountService, 
    private fb: FormBuilder,
    private router: Router) {
      this.expenseForm = this.fb.group({
        description: ['', Validators.required],
        amount: [0, Validators.required],
        date: ['', Validators.required],
      });
     }

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
      this.loadExpensesByAccount(this.selectedAccount.id);
    } else if (this.accounts.length > 0) {
      this.selectedAccount = this.accounts[0];
      this.loadExpensesByAccount(this.selectedAccount.id);
    }
  }

  loadExpensesByAccount(accountId: number): void {
    this.expenseService.getExpensesByAccount(accountId).subscribe(expenses => {
      this.expenses = expenses;
    });
  }

  onAccountChange(): void {
    if (this.selectedAccount) {
      localStorage.setItem('selectedAccountId', this.selectedAccount.id.toString());
      this.loadExpensesByAccount(this.selectedAccount.id);
    }
  }

  openAddExpenseModal(): void {
    this.isAddExpenseModalOpen = true;
  }

  closeAddExpenseModal(): void {
    this.isAddExpenseModalOpen = false;
  }

  onSubmitExpense(): void {
    if (this.expenseForm.valid && this.selectedAccount) {
      const newExpense: Expense = {
        ...this.expenseForm.value,
        accountId: this.selectedAccount.id
      };
      this.expenseService.addExpense(newExpense).subscribe({
        next: () => {
          this.loadExpensesByAccount(this.selectedAccount!.id);
          this.expenseForm.reset();
          this.closeAddExpenseModal();
        },
        error: (err) => {
          console.error('Failed to add expense', err);
          // Handle error appropriately
        }
      });
    }
  }

  deleteExpense(expense: Expense): void {
    this.expenseService.deleteExpense(expense.id).subscribe(() => {
      this.loadExpensesByAccount(this.selectedAccount!.id);
    });
  }

  createAccount(): void {
    this.router.navigate(['/accounts']); // Adjust the route as necessary
  }
}
