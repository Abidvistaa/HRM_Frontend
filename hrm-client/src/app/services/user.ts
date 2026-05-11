import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:5001/api/UserManagement';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // helper to create headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }


  // GET All Roles
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllRoles`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET All
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllUsers`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET
  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetUserById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST
  registerUser(obj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddUser`, obj, {
      headers: this.getAuthHeaders()
    });
  }

  // UPDATE
  updateUser(id: number, obj: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateUser}`, obj, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteUser/${id}`, {
      headers: this.getAuthHeaders()
    });

  }
}

