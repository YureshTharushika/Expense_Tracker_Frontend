import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { Expense } from '../models/expense.model';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
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
    private fb: FormBuilder) {
      this.expenseForm = this.fb.group({
        description: ['', Validators.required],
        amount: [0, Validators.required],
        date: ['', Validators.required],
      });
     }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadSelectedAccount();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  loadSelectedAccount(): void {
    const storedAccountId = localStorage.getItem('selectedAccountId');
    if (storedAccountId) {
      this.accountService.getAccountById(+storedAccountId).subscribe(account => {
        this.selectedAccount = account;
        this.loadExpensesByAccount(account.id);
      });
    }
  }

  loadExpenses(): void {
    if (this.selectedAccount) {
      this.expenseService.getExpensesByAccount(this.selectedAccount.id).subscribe(expenses => {
        this.expenses = expenses;
      });
    }
  }

  onAccountChange(): void {
    if (this.selectedAccount) {
      localStorage.setItem('selectedAccountId', this.selectedAccount.id.toString());
      this.loadExpensesByAccount(this.selectedAccount.id);
    }
  }

  loadExpensesByAccount(accountId: number): void {
    this.expenseService.getExpensesByAccount(accountId).subscribe(expenses => {
      this.expenses = expenses;
    });
  }

  openAddExpenseModal(): void {
    this.isAddExpenseModalOpen = true;
  }

  closeAddExpenseModal(): void {
    this.isAddExpenseModalOpen = false;
  }

  onSubmitExpense(): void {
    if (this.expenseForm.valid && this.selectedAccount) {
      const newExpense = {
        ...this.expenseForm.value,
        accountId: this.selectedAccount.id
      };
      this.expenseService.addExpense(newExpense).subscribe(() => {
        this.loadExpensesByAccount(this.selectedAccount!.id);
        this.closeAddExpenseModal();
        this.expenseForm.reset();
      });
    }
  }

  deleteExpense(expense: Expense): void {
    this.expenseService.deleteExpense(expense.id).subscribe(() => {
      this.loadExpensesByAccount(this.selectedAccount!.id);
    });
  }

}
