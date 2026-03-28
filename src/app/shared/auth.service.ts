import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, switchMap, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: AdminUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<AdminUser | null>(null);
  currentUser$ = this.currentUser.asObservable();
  private apiUrl = environment.apiUrl;
  private isRefreshing = false;

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        this.storeTokens(res.token, res.refreshToken);
        localStorage.setItem('acs_user', JSON.stringify(res.user));
        this.currentUser.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('acs_token');
    localStorage.removeItem('acs_refresh_token');
    localStorage.removeItem('acs_user');
    this.currentUser.next(null);
  }

  getToken(): string | null {
    const token = localStorage.getItem('acs_token');
    if (!token) return null;

    if (this.isTokenExpired(token)) {
      this.tryRefresh();
      return localStorage.getItem('acs_token');
    }

    return token;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('acs_token');
    const refreshToken = localStorage.getItem('acs_refresh_token');
    if (!token && !refreshToken) return false;
    if (token && !this.isTokenExpired(token)) return true;
    if (refreshToken && !this.isTokenExpired(refreshToken)) return true;
    return false;
  }

  currentUserInitial(): string {
    return this.currentUser.value?.name?.charAt(0)?.toUpperCase() || 'A';
  }

  refreshAccessToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('acs_refresh_token');
    if (!refreshToken || this.isTokenExpired(refreshToken)) {
      this.logout();
      return throwError(() => new Error('No valid refresh token'));
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(res => {
        this.storeTokens(res.token, res.refreshToken);
        localStorage.setItem('acs_user', JSON.stringify(res.user));
        this.currentUser.next(res.user);
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('acs_token', accessToken);
    localStorage.setItem('acs_refresh_token', refreshToken);
  }

  private restoreSession(): void {
    const token = localStorage.getItem('acs_token');
    const refreshToken = localStorage.getItem('acs_refresh_token');
    const user = localStorage.getItem('acs_user');

    if (token && user && !this.isTokenExpired(token)) {
      this.currentUser.next(JSON.parse(user));
    } else if (refreshToken && !this.isTokenExpired(refreshToken) && user) {
      this.currentUser.next(JSON.parse(user));
      this.tryRefresh();
    } else {
      this.logout();
    }
  }

  private tryRefresh(): void {
    if (this.isRefreshing) return;
    this.isRefreshing = true;

    this.refreshAccessToken().subscribe({
      next: () => { this.isRefreshing = false; },
      error: () => { this.isRefreshing = false; }
    });
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
