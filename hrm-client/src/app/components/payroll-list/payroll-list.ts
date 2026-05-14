import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PayrollService } from '../../services/payroll';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll-list.html',
  styleUrl: './payroll-list.css',
})
export class PayrollListComponent implements OnInit {

  payrolls: any[] = [];
  filteredPayrolls: any[] = [];

  searchText = '';

  currentPage = 1;
  pageSize = 5;

  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private payrollService: PayrollService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPayrolls();
  }

  // LOAD PAYROLLS
  loadPayrolls(): void {

    this.payrollService.getPayrolls().subscribe({
      next: (data) => {

        this.payrolls = data;
        this.filteredPayrolls = data;

      },
      error: (err) => console.error(err)
    });
  }

  // SEARCH
  onSearch(): void {

    const text = this.searchText.toLowerCase();

    this.filteredPayrolls = this.payrolls.filter(p =>
      (p.employeeName ?? '').toLowerCase().includes(text)
    );

    this.currentPage = 1;
  }

  // PAGINATION
  get pagedPayrolls() {

    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredPayrolls.slice(start, start + this.pageSize);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  nextPage(): void {

    if (this.currentPage * this.pageSize < this.filteredPayrolls.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // EDIT
  editPayroll(id: number): void {

    this.router.navigate(['/payroll/edit', id]);
  }

  // DELETE
  deletePayroll(id: number): void {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this payroll?'
    );

    if (!confirmDelete) {
      return;
    }

    this.payrollService.deletePayroll(id).subscribe({
      next: () => {
        this.loadPayrolls();
      },
      error: (err) => console.error(err)
    });
  }
}
