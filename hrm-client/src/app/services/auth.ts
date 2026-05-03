import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:5001/api/usermanagement/login';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']); // optional but recommended
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
