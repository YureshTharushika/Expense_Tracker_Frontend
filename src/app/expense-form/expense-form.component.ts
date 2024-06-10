import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';
import { CommonModule } from '@angular/common';
import { Expense } from '../models/expense.model';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})
export class ExpenseFormComponent implements OnInit {

  @Input() selectedAccount: Account | null = null;
  expenseForm: FormGroup;

  constructor(private fb: FormBuilder, private expenseService: ExpenseService) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.expenseForm.valid && this.selectedAccount) {
      const expense: Expense = {
        ...this.expenseForm.value,
        accountId: this.selectedAccount.id
      };
      this.expenseService.addExpense(expense).subscribe(() => {
        this.expenseForm.reset();
        
      });
    }
  }

}
