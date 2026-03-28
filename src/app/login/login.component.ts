import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    const trimmedEmail = this.email.trim();

    if (!trimmedEmail) {
      this.errorMessage = 'Email is required.';
      return;
    }
    if (!this.isValidEmail(trimmedEmail)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password is required.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;
    this.authService.login(trimmedEmail, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin']);
      },
      error: (err: unknown) => {
        this.loading = false;
        this.errorMessage = this.extractErrorMessage(err);
      },
    });
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private extractErrorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const body = (err as { error?: unknown }).error;
      if (typeof body === 'string' && body.trim()) {
        return body;
      }
      if (body && typeof body === 'object' && 'message' in body) {
        const msg = (body as { message?: unknown }).message;
        if (typeof msg === 'string') {
          return msg;
        }
        if (Array.isArray(msg)) {
          return msg.filter((m): m is string => typeof m === 'string').join(' ');
        }
      }
    }
    if (err && typeof err === 'object' && 'message' in err) {
      const m = (err as { message?: unknown }).message;
      if (typeof m === 'string') {
        return m;
      }
    }
    return 'Login failed. Please try again.';
  }
}
