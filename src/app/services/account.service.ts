import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Account } from '../models/account.model';



@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://localhost:7057/api/accounts';

  private selectedAccountSubject = new BehaviorSubject<Account | null>(null);
  selectedAccount$ = this.selectedAccountSubject.asObservable();

  constructor(private http: HttpClient) {}

  setSelectedAccount(account: Account): void {
    this.selectedAccountSubject.next(account);
  }

  getSelectedAccount(): Account | null {
    return this.selectedAccountSubject.getValue();
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getAccount(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  updateAccount(account: Account): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${account.id}`, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAccountById(accountId: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${accountId}`);
  }

  updateAccountBalance(id: number, newBalance: number): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}/balance`, { balance: newBalance }).pipe(
      switchMap(() => this.getAccountById(id)) // Retrieve the updated account after balance update
    );
  }
}
