import { Component } from '@angular/core';
import { Budget } from '../models/budget.model';
import { BudgetService } from '../services/budget.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Expense } from '../models/expense.model';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css'
})
export class BudgetListComponent {

  budgets: Budget[] = [];
  accounts: Account[] = [];
  budgetForm: FormGroup;
  isAddBudgetModalOpen = false;
  selectedAccountId: number | null = null;
  selectedAccount: Account | null = null;
  faPlusCircle = faPlusCircle;
  faTrash = faTrash;
  expenses: Expense[] = [];

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private accountService: AccountService,
    private expenseService: ExpenseService,
    private router: Router
  ) {
    this.budgetForm = this.fb.group({
      name: ['', Validators.required],
      allocatedAmount: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
    // console.log(this.getBudgetTileClass(this.budgets[0]));
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
      this.loadBudgets();
    } else if (this.accounts.length > 0) {
      this.selectedAccount = this.accounts[0];
      this.loadBudgets();
    }
  }

  loadBudgets(): void {
    if (this.selectedAccount?.id !== null) {
      this.budgetService.getBudgetsByAccount(this.selectedAccount!.id).subscribe(budgets => {
        this.budgets = budgets;
        this.loadExpenses();
      });
    } else {
      this.budgets = [];
    }
  }

  loadExpenses(): void {
    if (this.selectedAccount?.id !== null) {
      this.expenseService.getExpensesByAccount(this.selectedAccount!.id).subscribe(expenses => {
        this.expenses = expenses;
      });
    } else {
      this.expenses = [];
    }
  }

  addBudget(): void {
    this.isAddBudgetModalOpen = true;
  }

  closeAddBudgetModal(): void {
    this.isAddBudgetModalOpen = false;
  }

  onSubmit(): void {
    if (this.budgetForm.valid && this.selectedAccount?.id !== null) {
      const newBudget = {
        ...this.budgetForm.value,
        accountId: this.selectedAccount?.id
      };

      this.budgetService.addBudget(newBudget).subscribe(() => {
        this.loadBudgets();
        this.budgetForm.reset();
        this.closeAddBudgetModal();
      });
    }
  }

  viewBudget(id: number): void {
    this.router.navigate(['/budgets', id]);
  }

  createAccount(): void {
    this.router.navigate(['/accounts']);
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
