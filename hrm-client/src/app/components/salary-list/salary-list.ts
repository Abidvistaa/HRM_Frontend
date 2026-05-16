import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SalaryService } from '../../services/salary';

@Component({
  selector: 'app-salary-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-list.html',
  styleUrl: './salary-list.css',
})
export class SalaryListComponent implements OnInit {

  salaries: any[] = [];
  filteredSalaries: any[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 5;

  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private salaryService: SalaryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalaries();
  }

  // LOAD DATA
loadSalaries(): void {
  this.salaryService.getSalaries().subscribe({
    next: (res: any) => {
      this.salaries = res.data || [];
      this.filteredSalaries = res.data || [];
    },

    error: (err) => console.error(err)
  });
}

  // SEARCH
  onSearch(): void {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredSalaries = this.salaries;
      this.currentPage = 1;
      return;
    }

    this.filteredSalaries = this.salaries.filter(s => {

      const employeeId = String(s.employeeId ?? '').toLowerCase();
      const employeeName = String(s.employeeName ?? '').toLowerCase();

      let monthName = '';

      if (s.effectiveDate) {
        const date = new Date(s.effectiveDate);
        monthName = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
      }

      const fullDate = s.effectiveDate
        ? new Date(s.effectiveDate).toLocaleDateString().toLowerCase()
        : '';

      return (
        employeeId.includes(text) ||
        employeeName.includes(text) ||
        monthName.includes(text) ||
        fullDate.includes(text)
      );
    });

    this.currentPage = 1;
  }

  // PAGINATION DATA
  get pagedSalaries() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSalaries.slice(start, start + this.pageSize);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.filteredSalaries.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get pageInfo(): string {
    const total = this.filteredSalaries.length;

    if (total === 0) {
      return 'No entries';
    }

    const start = (this.currentPage - 1) * this.pageSize + 1;

    let end = this.currentPage * this.pageSize;

    if (end > total) {
      end = total;
    }

    return `Showing ${start} to ${end} of ${total} entries`;
  }

  // EDIT
  editSalary(id: number): void {
    this.router.navigate(['/salary/edit', id]);
  }

deleteSalary(id: number): void {
  const confirmDelete = confirm(
    'Are you sure you want to delete this salary record?'
  );

  if (!confirmDelete) return;

  this.salaryService.deleteSalary(id).subscribe({
    next: () => this.loadSalaries(),

    error: (err) => {

      const message =
        err?.error?.message ||   // your backend custom message
        err?.error?.title ||     // fallback
        err?.message ||          // network error
        'Something went wrong';

      alert(message);
    }
  });
}
}
