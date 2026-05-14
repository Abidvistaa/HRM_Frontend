import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private apiUrl = 'https://localhost:5001/api/Payroll';

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
  getPayrolls(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllPayrolls`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET
  getPayroll(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetPayrollById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST
  addPayroll(obj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddPayroll`, obj, {
      headers: this.getAuthHeaders()
    });
  }

  // UPDATE
  updatePayroll(id: number, obj: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdatePayroll/${id}`, obj, {
      headers: this.getAuthHeaders()
    });
  }
  // DELETE
  deletePayroll(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeletePayroll/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

}
