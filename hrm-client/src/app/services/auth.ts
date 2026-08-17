import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:5001/api/UserManagement';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login`, data).pipe(
      tap((res) => {

        if (res && res.success === true) {

          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.userName);
          localStorage.setItem('rolename', res.roleName);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getRolename(): string {
    return localStorage.getItem('rolename') || '';
  }

  private tokenExpMessage = '';
  isLoggedIn(): boolean {

    const token = this.getToken();

    // No token
    if (!token) {
      return false;
    }

    try {

      // JWT format:
      // header.payload.signature
      const payload = JSON.parse(atob(token.split('.')[1]));

      const expiration = payload.exp;

      // Current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);

      // Token expired
      if (expiration <= currentTime) {
        this.clearSession();
        this.logout();
        this.tokenExpMessage = 'Your session has expired. Please login again.';
        return false;
      }

      // Token is still valid
      return true;

    } catch (error) {

      // Invalid/malformed token
      this.clearSession();
      return false;
    }
  }

  getTokenExpMessage(): string {
    return this.tokenExpMessage;
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('');
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('rolename');
  }
}
