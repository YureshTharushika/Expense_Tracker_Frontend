import { Component } from '@angular/core';
import { Budget } from '../models/budget.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BudgetService } from '../services/budget.service';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense.model';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './budget-detail.component.html',
  styleUrl: './budget-detail.component.css'
})
export class BudgetDetailComponent {


  budget: Budget | null = null;
  expenses: Expense[] = [];
  totalBudgetExpenses: number = 0;
  expenseForm: FormGroup;
  isAddExpenseModalOpen = false;
  faPlusCircle = faPlusCircle;
  faTrash = faTrash;

  constructor(
    private route: ActivatedRoute,
    private budgetService: BudgetService,
    private expenseService: ExpenseService,
    private fb: FormBuilder
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [0, Validators.required],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const budgetId = +params['id'];
      this.loadBudget(budgetId);
      this.loadExpenses(budgetId);
    });
  }

  loadBudget(budgetId: number): void {
    this.budgetService.getBudgetById(budgetId).subscribe(budget => {
      this.budget = budget;
    });
  }

  loadExpenses(budgetId: number): void {
    this.expenseService.getExpensesByBudgetId(budgetId).subscribe(expenses => {
      this.expenses = expenses;
      this.calculateTotalBudgetExpenses();
    });
  }

  calculateTotalBudgetExpenses(): void {
    this.totalBudgetExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  openAddExpenseModal(): void {
    this.isAddExpenseModalOpen = true;
  }

  closeAddExpenseModal(): void {
    this.isAddExpenseModalOpen = false;
  }

  onSubmit(): void {
    if (this.expenseForm.valid && this.budget) {
      const newExpense: Expense = {
        ...this.expenseForm.value,
        budgetId: this.budget.id,
        accountId: this.budget.accountId
      };

      this.expenseService.addExpense(newExpense).subscribe(expense => {
        this.expenses.push(expense);
        this.calculateTotalBudgetExpenses();
        this.expenseForm.reset();
        this.closeAddExpenseModal();
      });
    }
  }

}
