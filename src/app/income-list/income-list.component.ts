import { Component } from '@angular/core';
import { Income } from '../models/income.model';
import { Account } from '../models/account.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IncomeService } from '../services/income.service';
import { AccountService } from '../services/account.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-income-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './income-list.component.html',
  styleUrl: './income-list.component.css'
})
export class IncomeListComponent {

  incomes: Income[] = [];
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  incomeForm: FormGroup;
  isAddIncomeModalOpen = false;
  faPlusCircle = faPlusCircle;
  faTrash = faTrash;


  constructor(
    private fb: FormBuilder,
    private incomeService: IncomeService,
    private accountService: AccountService
  ) {
    this.incomeForm = this.fb.group({
      name: ['', Validators.required],
      amount: [0, Validators.required],
      date: ['', Validators.required]
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
      this.loadIncomes();
    } else if (this.accounts.length > 0) {
      this.selectedAccount = this.accounts[0];
      this.loadIncomes();
    }
  }

  loadIncomes(): void {
    if (this.selectedAccount?.id !== null) {
      this.incomeService.getIncomes().subscribe(incomes => {
        this.incomes = incomes.filter(income => income.accountId === this.selectedAccount!.id);
      });
    } else {
      this.incomes = [];
    }
  }

  addIncome(): void {
    this.isAddIncomeModalOpen = true;
  }

  closeAddIncomeModal(): void {
    this.isAddIncomeModalOpen = false;
  }

  onSubmit(): void {
    if (this.incomeForm.valid && this.selectedAccount?.id !== null) {
      const newIncome = {
        ...this.incomeForm.value,
        accountId: this.selectedAccount?.id
      };

      this.incomeService.addIncome(newIncome).subscribe(() => {
        this.loadIncomes();
        this.incomeForm.reset();
        this.closeAddIncomeModal();
      });
    }
  }

  viewIncome(id: number): void {
    // Implement view income logic if needed
  }

}
