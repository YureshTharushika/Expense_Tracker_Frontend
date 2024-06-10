import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = 'https://localhost:7057/api/expenses';
  private expenseAddedSource = new Subject<void>();

  expenseAdded$ = this.expenseAddedSource.asObservable();

  constructor(private http: HttpClient) { }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      tap(() => this.expenseAddedSource.next())
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
