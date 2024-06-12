import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, switchMap, tap } from 'rxjs';
import { Expense } from '../models/expense.model';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = 'https://localhost:7057/api/expenses';
  private expenseAddedSource = new Subject<void>();

  expenseAdded$ = this.expenseAddedSource.asObservable();

  constructor(private http: HttpClient, private accountService: AccountService) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  // addExpense(expense: Expense): Observable<Expense> {
  //     return this.http.post<Expense>(this.apiUrl, expense).pipe(
  //         switchMap((newExpense) => {
  //             // Update the account balance after adding the expense
  //             return this.accountService.getAccountById(newExpense.accountId).pipe(
  //                 switchMap((account) => {
  //                     const newBalance = account.balance - newExpense.amount;
  //                     return this.accountService.updateAccountBalance(account.id, newBalance).pipe(
  //                         map(() => newExpense) // Return the newExpense after balance update
  //                     );
  //                 })
  //             );
  //         })
  //     );
  // }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      switchMap((newExpense) => {
        return this.accountService.getAccountById(newExpense.accountId).pipe(
          switchMap((account) => {
            const newBalance = account.balance - newExpense.amount;
            return this.accountService.updateAccountBalance(account.id, newBalance).pipe(
              tap(() => this.accountService.setSelectedAccount({ ...account, balance: newBalance })),
              // Return the newly created expense instead of making a second POST request
              switchMap(() => this.http.get<Expense>(`${this.apiUrl}/${newExpense.id}`))
            );
          })
        );
      })
    );
  }


  updateExpense(expense: Expense): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${expense.id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getExpensesByAccount(accountId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/byAccount/${accountId}`);
  }
}
