import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://localhost:5001/api/Employee';

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

  // GET All
  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllEmployees`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET
  getEmployee(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetEmployeeById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST
  addEmployee(obj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddEmployee`, obj, {
      headers: this.getAuthHeaders()
    });
  }

  // UPDATE
  updateEmployee(id: number, obj: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateEmployee/${id}`, obj, {
      headers: this.getAuthHeaders()
    });
  }
  // DELETE
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteEmployee/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

}
