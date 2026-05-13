import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  filteredEmployees: any[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
      },
      error: (err) => console.error(err)
    });
  }

  // SEARCH
  onSearch(): void {
    const text = this.searchText.toLowerCase();

    this.filteredEmployees = this.employees.filter(e =>
      (e.name ?? '').toLowerCase().includes(text)
    );

    this.currentPage = 1;
  }

  // PAGINATION
  get pagedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.filteredEmployees.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // EDIT
  editEmployee(id: number): void {
    this.router.navigate(['/employee/edit', id]);
  }

  // DELETE
  deleteEmployee(id: number): void {

  const confirmDelete = window.confirm(
    'Are you sure you want to delete this employee?'
  );

  if (!confirmDelete) {
    return; // stop deletion
  }

  this.employeeService.deleteEmployee(id).subscribe({
    next: () => {
      this.loadEmployees();
    },
    error: (err) => console.error(err)
  });
}
}
