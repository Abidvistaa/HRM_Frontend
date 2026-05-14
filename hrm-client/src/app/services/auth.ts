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

      // only store if success
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

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();

    this.router.navigateByUrl('');
  }
}
