import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Chart, ChartItem, registerables } from 'chart.js';
import { Budget } from '../models/budget.model';
import { BudgetService } from '../services/budget.service';
import { AccountService } from '../services/account.service';
import { ExpenseService } from '../services/expense.service';
import { Account } from '../models/account.model';
import { Expense } from '../models/expense.model';


Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit, AfterViewChecked {

  budgets: Budget[] = [];
  accounts: Account[] = [];
  expenses: Expense[] = [];
  selectedAccount: Account | null = null;
  totalBudgetExpenses: number = 0;
  selectedTab: string = 'budgets';
  private barChartInstance: Chart | null = null;
  private lineChartInstance: Chart | null = null;
  private barChartInitialized: boolean = false;
  private lineChartInitialized: boolean = false;


  @ViewChild('budgetBarChartCanvas') budgetBarChartCanvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('budgetLineChartCanvas') budgetLineChartCanvas: ElementRef<HTMLCanvasElement> | undefined;


  constructor(
    private budgetService: BudgetService,
    private accountService: AccountService,
    private expenseService: ExpenseService
    ) {}
    
    ngAfterViewChecked(): void {
      if (this.selectedTab === 'budgets') {
        if (this.budgetBarChartCanvas && !this.barChartInitialized) {
          const barCtx = this.budgetBarChartCanvas.nativeElement.getContext('2d');
          if (barCtx) {
            this.createBarChart(barCtx);
            this.barChartInitialized = true;
          }
        }
        if (this.budgetLineChartCanvas && !this.lineChartInitialized) {
          const lineCtx = this.budgetLineChartCanvas.nativeElement.getContext('2d');
          if (lineCtx) {
            this.createLineChart(lineCtx);
            this.lineChartInitialized = true;
          }
        }
      }
    }
  
    ngOnDestroy(): void {
      if (this.barChartInstance) {
        this.barChartInstance.destroy();
      }
      if (this.lineChartInstance) {
        this.lineChartInstance.destroy();
      }
    }

    ngOnInit(): void {
      this.loadAccounts();
    }

    selectTab(tab: string): void {
      this.selectedTab = tab;
      this.barChartInitialized = false; // Reset chart initialization flag
      this.lineChartInitialized = false; // Reset chart initialization flag
      if (tab === 'budgets') {
        if (this.budgetBarChartCanvas) {
          const barCtx = this.budgetBarChartCanvas.nativeElement.getContext('2d');
          if (barCtx) {
            this.createBarChart(barCtx);
            this.barChartInitialized = true;
          }
        }
        if (this.budgetLineChartCanvas) {
          const lineCtx = this.budgetLineChartCanvas.nativeElement.getContext('2d');
          if (lineCtx) {
            this.createLineChart(lineCtx);
            this.lineChartInitialized = true;
          }
        }
      }
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
          if (this.selectedTab === 'budgets') {
            if (this.budgetBarChartCanvas) {
              const barCtx = this.budgetBarChartCanvas.nativeElement.getContext('2d');
              if (barCtx) {
                this.createBarChart(barCtx);
                this.barChartInitialized = true;
              }
            }
            if (this.budgetLineChartCanvas) {
              const lineCtx = this.budgetLineChartCanvas.nativeElement.getContext('2d');
              if (lineCtx) {
                this.createLineChart(lineCtx);
                this.lineChartInitialized = true;
              }
            }
          }
        });
      } else {
        this.budgets = [];
      }
    }

    loadExpenses(budgetId: number): number {
      this.expenseService.getExpensesByBudgetId(budgetId).subscribe(expenses => {
        this.expenses = expenses;
      });
      return this.totalBudgetExpenses;
    }

    calculateTotalBudgetExpenses(budget: Budget): number {
      
      if (!budget.expenses || budget.expenses.length === 0) {
        return 0;
      }
      
      return budget.expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    createBarChart(ctx: ChartItem): void {
      if (this.budgets.length > 0) {
        const budgetNames = this.budgets.map(budget => budget.name);
        const allocatedAmounts = this.budgets.map(budget => budget.allocatedAmount);
        const actualSpending = this.budgets.map(budget => this.calculateTotalBudgetExpenses(budget));
  
        if (this.barChartInstance) {
          this.barChartInstance.destroy(); // Destroy the previous chart instance
        }
  
        this.barChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: budgetNames,
            datasets: [
              {
                label: 'Allocated Budget',
                data: allocatedAmounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              },
              {
                label: 'Actual Spending',
                data: actualSpending,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  
    createLineChart(ctx: ChartItem): void {
      if (this.budgets.length > 0) {
        const budgetNames = this.budgets.map(budget => budget.name);
        const allocatedAmounts = this.budgets.map(budget => budget.allocatedAmount);
        const actualSpending = this.budgets.map(budget => this.calculateTotalBudgetExpenses(budget));
  
        if (this.lineChartInstance) {
          this.lineChartInstance.destroy(); // Destroy the previous chart instance
        }
  
        this.lineChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: budgetNames,
            datasets: [
              {
                label: 'Allocated Budget',
                data: allocatedAmounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
              },
              {
                label: 'Actual Spending',
                data: actualSpending,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }

}
