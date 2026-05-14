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

  // LOAD
  loadSalaries(): void {

    this.salaryService.getSalaries().subscribe({

      next: (data) => {
        this.salaries = data;
        this.filteredSalaries = data;
      },

      error: (err) => console.error(err)

    });
  }

  // SEARCH
  onSearch(): void {

    const text = this.searchText.toLowerCase();

    this.filteredSalaries = this.salaries.filter(s =>
      (s.employeeId ?? '').toLowerCase().includes(text)
    );

    this.currentPage = 1;
  }

  // PAGINATION
  get pagedSalaries() {

    const start =
      (this.currentPage - 1) * this.pageSize;

    return this.filteredSalaries.slice(
      start,
      start + this.pageSize
    );
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  nextPage(): void {

    if (
      this.currentPage * this.pageSize
      < this.filteredSalaries.length
    ) {
      this.currentPage++;
    }
  }

  prevPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // EDIT
  editSalary(id: number): void {

    this.router.navigate([
      '/salary/edit',
      id
    ]);
  }

  // DELETE
  deleteSalary(id: number): void {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this salary record?'
    );

    if (!confirmDelete) {
      return;
    }

    this.salaryService.deleteSalary(id).subscribe({

      next: () => {
        this.loadSalaries();
      },

      error: (err) => console.error(err)

    });
  }
}
