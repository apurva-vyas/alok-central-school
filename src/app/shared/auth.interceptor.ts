import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshDone$ = new BehaviorSubject<boolean>(false);

  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isOwnApi = req.url.startsWith('/api') || req.url.includes(environment.apiUrl);
    if (!isOwnApi) {
      return next.handle(req);
    }

    const authReq = this.addToken(req);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
          return this.handle401(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('acs_token');
    if (token) {
      return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return req;
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshDone$.next(false);

      return this.auth.refreshAccessToken().pipe(
        switchMap(() => {
          this.isRefreshing = false;
          this.refreshDone$.next(true);
          return next.handle(this.addToken(req));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.auth.logout();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    }

    return this.refreshDone$.pipe(
      filter(done => done),
      take(1),
      switchMap(() => next.handle(this.addToken(req)))
    );
  }
}
