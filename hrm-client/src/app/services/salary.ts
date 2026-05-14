import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  private apiUrl = 'https://localhost:5001/api/Salary';

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
  getSalaries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllSalaries`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET
  getSalary(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetSalaryById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST
  addSalary(obj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddSalary`, obj, {
      headers: this.getAuthHeaders()
    });
  }

  // UPDATE
  updateSalary(id: number, obj: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateSalary/${id}`, obj, {
      headers: this.getAuthHeaders()
    });
  }
  // DELETE
  deleteSalary(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteSalary/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

}
