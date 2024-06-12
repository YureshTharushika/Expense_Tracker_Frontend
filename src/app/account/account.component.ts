import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { Expense } from '../models/expense.model';
import { ExpenseService } from '../services/expense.service';
import { CommonModule } from '@angular/common';
import { ExpenseFormComponent } from "../expense-form/expense-form.component";
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-account',
    standalone: true,
    templateUrl: './account.component.html',
    styleUrl: './account.component.css',
    imports: [CommonModule, ReactiveFormsModule, ExpenseFormComponent, FontAwesomeModule]
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  expenses: Expense[] = [];
  isAddAccountModalOpen = false;

  faPlusCircle = faPlusCircle;
  faTrash = faTrash;

  constructor(
    private fb: FormBuilder, 
    private accountService: AccountService, 
    private expenseService: ExpenseService) {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      balance: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
    // const savedAccountId = localStorage.getItem('selectedAccountId');
    // if (savedAccountId) {
    //   const accountId = parseInt(savedAccountId, 10);
    //   const account = this.accounts.find(acc => acc.id === accountId);
    //   if (account) {
    //     this.onAccountChange(account);
    //   }
    // }
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
      const storedAccountId = localStorage.getItem('selectedAccountId');
      if (storedAccountId) {
        const storedAccount = accounts.find(account => account.id === +storedAccountId);
        if (storedAccount) {
          this.selectedAccount = storedAccount;
          this.onAccountChange(storedAccount);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      this.accountService.addAccount(this.accountForm.value).subscribe(newAccount => {
        this.loadAccounts();
        this.accountForm.reset();
        this.closeAddAccountModal();
        if (this.accounts.length === 0) {
          this.onAccountChange(newAccount);
        }
      });
    }
  }

  onAccountChange(account: Account): void {
    this.selectedAccount = account;
    this.accountService.setSelectedAccount(account);
    this.loadExpensesByAccount(account.id);
  }

  loadExpensesByAccount(accountId: number): void {
    this.expenseService.getExpensesByAccount(accountId).subscribe(expenses => {
      this.expenses = expenses;
    });
  }

  openAddAccountModal() {
    this.isAddAccountModalOpen = true;
  }

  closeAddAccountModal() {
    this.isAddAccountModalOpen = false;
  }

  deleteAccount(account: Account) {
    // Implement account deletion logic here
  }

}
