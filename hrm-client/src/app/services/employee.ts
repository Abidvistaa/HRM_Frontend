import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://localhost:5001/api/book/getbooklist';

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

  // GET all employees
  getEmployees(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // POST employee
  addEmployee(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE employee
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
