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
      next: (res) => {
        this.employees = res.data;
        this.filteredEmployees = res.data;
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

    get pageInfo(): string {
    const total = this.filteredEmployees.length;

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
  editEmployee(id: number): void {
    this.router.navigate(['/employee/edit', id]);
  }

  // DELETE
deleteEmployee(id: number): void {

  const confirmDelete = window.confirm(
    'Are you sure you want to delete this employee?'
  );

  if (!confirmDelete) return;

  this.employeeService.deleteEmployee(id).subscribe({
    next: () => {
      this.loadEmployees();
    },

    error: (err) => {

      const message =
        err?.error?.message ||   // backend custom message
        err?.error?.title ||
        err?.message ||
        'Failed to delete employee';

      alert(message);
    }
  });
}

selectedEmployee: any = {};

barcodeUrl = '';

viewEmployeeCard(emp: any): void {

  // Save selected employee
  this.selectedEmployee = emp;

  this.employeeService.getEmployeeBarcode(emp.id).subscribe({

    next: (blob: Blob) => {

      if (this.barcodeUrl) {
        URL.revokeObjectURL(this.barcodeUrl);
      }

      this.barcodeUrl = URL.createObjectURL(blob);

    },

    error: err => console.error(err)

  });

}
downloadBarcode(id: number): void {

  this.employeeService.downloadEmployeeBarcode(id).subscribe({

    next: (response) => {

      const blob = response.body!;

      const contentDisposition =
        response.headers.get('content-disposition');

      let fileName = `Employee_Barcode_${id}.png`;

      if (contentDisposition) {

        const utf8Match =
          contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

        if (utf8Match) {

          fileName = decodeURIComponent(utf8Match[1]);

        } else {

          const fileNameMatch =
            contentDisposition.match(/filename="?([^";]+)"?/i);

          if (fileNameMatch) {
            fileName = fileNameMatch[1];
          }
        }
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;
      link.download = fileName;

      link.click();

      window.URL.revokeObjectURL(url);
    },

    error: err => console.error(err)

  });

}

}
