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
  pageSize = 20;

  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private payrollService: PayrollService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPayrolls();
  }

  // LOAD DATA
  loadPayrolls(): void {
    this.payrollService.getPayrolls().subscribe({
      next: (res) => {
        this.payrolls = res.data;
        this.filteredPayrolls = res.data;
      },
      error: (err) => console.error(err)
    });
  }

onSearch(): void {
  const text = this.searchText.toLowerCase().trim();

  if (!text) {
    this.filteredPayrolls = this.payrolls;
    return;
  }

  this.filteredPayrolls = this.payrolls.filter(p => {
    const name = String(p.employeeName ?? '').toLowerCase();
    const month = String(p.payrollMonthString ?? '').toLowerCase();

    return (
      name.includes(text) ||
      month.includes(text)
    );
  });

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

    get pageInfo(): string {
    const total = this.filteredPayrolls.length;

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

  // DELETE
  deletePayroll(id: number): void {

    const confirmDelete = confirm(
      'Are you sure you want to delete this payroll?'
    );

    if (!confirmDelete) return;

    this.payrollService.deletePayroll(id).subscribe({
      next: () => this.loadPayrolls(),
      error: (err) => console.error(err)
    });
  }
}
