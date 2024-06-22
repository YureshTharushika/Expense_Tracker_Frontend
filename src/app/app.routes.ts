import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { AccountComponent } from './account/account.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { IncomeListComponent } from './income-list/income-list.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { authGuard } from './auth.guard';


// export const routes: Routes = [

//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'expenses', component: ExpenseListComponent },
//   { path: 'incomes', component: IncomeListComponent },
//   { path: 'budgets', component: BudgetListComponent },
//   { path: 'budgets/:id', component: BudgetDetailComponent },
//   { path: 'analytics', component: AnalyticsComponent },
//   { path: 'monthly-plan', component: ExpenseFormComponent }, // Placeholder component
//   { path: 'accounts', component: AccountComponent },
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
// ];

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'expenses', component: ExpenseListComponent },
      { path: 'incomes', component: IncomeListComponent },
      { path: 'budgets', component: BudgetListComponent },
      { path: 'budgets/:id', component: BudgetDetailComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'monthly-plan', component: ExpenseFormComponent }, // Placeholder component
      { path: 'accounts', component: AccountComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
