import { Injectable, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, throwError } from 'rxjs';

interface AuthUser {
  email: string;
  name: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  private _user = signal<AuthUser | null>(this.loadFromStorage());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  login(email: string, password: string): Observable<AuthUser> {
    if (email === 'admin@test.com' && password === 'password') {
      const user: AuthUser = {
        email,
        name: 'Admin User',
        token: 'fake-jwt-' + Date.now(),
      };
      this._user.set(user);
      localStorage.setItem('auth', JSON.stringify(user));
      return of(user).pipe(delay(400));
    }
    return throwError(() => new Error('Invalid credentials')).pipe(delay(400));
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem('auth');
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return this._user()?.token ?? null;
  }

  private loadFromStorage(): AuthUser | null {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  }
}
