import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  // Load all employees
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }

  // Delete employee
  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees(); // refresh list after delete
      },
      error: (err) => {
        console.error('Delete error:', err);
      }
    });
  }
}
