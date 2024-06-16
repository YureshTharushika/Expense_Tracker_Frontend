import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { AccountComponent } from './account/account.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { IncomeListComponent } from './income-list/income-list.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpenseListComponent },
  { path: 'incomes', component: IncomeListComponent },
  { path: 'budget', component: BudgetListComponent },
  { path: 'budgets/:id', component: BudgetDetailComponent },
  { path: 'monthly-plan', component: ExpenseFormComponent }, // Placeholder component
  { path: 'accounts', component: AccountComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
