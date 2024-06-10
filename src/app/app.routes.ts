import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { AccountComponent } from './account/account.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpenseListComponent },
  { path: 'budget', component: ExpenseFormComponent }, // Placeholder component
  { path: 'monthly-plan', component: ExpenseFormComponent }, // Placeholder component
  { path: 'accounts', component: AccountComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
