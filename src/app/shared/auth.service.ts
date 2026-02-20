import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:7220/api/auth';
  private isBrowser: boolean;

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const user = this.getUserFromStorage();
      if (user) {
        user.roles = this.getRolesFromToken(user.accessToken);
        this.userSubject.next(user);
      }
    }
  }

  login(data: any) {
    return this.http.post<User>(`${this.baseUrl}/login`, data).pipe(
      tap(user => {
        user.roles = this.getRolesFromToken(user.accessToken);

        if (this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        this.userSubject.next(user);
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

 logout(router?: any) {
  if (this.isBrowser) {
    localStorage.removeItem('user');
  }
  this.userSubject.next(null);

  if (router) {
    router.navigate(['/']);
  }
}

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.roles?.includes('Admin') ?? false;
  }

  getToken(): string | null {
    return this.userSubject.value?.accessToken ?? null;
  }

  private getUserFromStorage(): User | null {
    if (!this.isBrowser) return null;

    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private getRolesFromToken(token: string): string[] {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      return Array.isArray(roles) ? roles : roles ? [roles] : [];
    } catch {
      return [];
    }
  }
}