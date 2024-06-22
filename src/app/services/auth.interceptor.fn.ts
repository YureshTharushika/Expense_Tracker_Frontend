import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  let isRefreshing = false;
  const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  const authToken = localStorage.getItem('access_token');
  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next);
      } else {
        return throwError(error);
      }
    })
  );

  function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((token: any) => {
          isRefreshing = false;
          refreshTokenSubject.next(token.accessToken);
          return next(
            request.clone({
              setHeaders: {
                Authorization: `Bearer ${token.accessToken}`
              }
            })
          );
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logout();
          return throwError(err);
        })
      );
    } else {
      return refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next(
            request.clone({
              setHeaders: {
                Authorization: `Bearer ${jwt}`
              }
            })
          );
        })
      );
    }
  }
}
