import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PayrollService } from '../../services/payroll';


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

//js pdf
exportPdf(): void {

  const doc = new jsPDF({
    orientation: 'landscape'
  });

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Payroll List', 14, 15);

  // Table Data
  const body = this.filteredPayrolls.map(p => [
    p.id,
    p.salaryId,
    p.employeeName,
    p.payrollMonthString,
    p.payrollYear,
    Number(p.basicSalary).toFixed(2),
    Number(p.bonus).toFixed(2),
    Number(p.deduction).toFixed(2),
    p.tax,
    Number(p.netSalary).toFixed(2),
    p.status,
    new Date(p.actionDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  ]);

  autoTable(doc, {

    startY: 25,

    head: [[
      'ID',
      'Salary ID',
      'Employee',
      'Month',
      'Year',
      'Basic Salary',
      'Bonus',
      'Deduction',
      'Tax (%)',
      'Net Salary',
      'Status',
      'Action Date'
    ]],

    body,

    theme: 'grid',

    styles: {
      textColor: [0, 0, 0],
      font: 'helvetica',
      fontSize: 8,
      halign: 'center',
      valign: 'middle',
      cellPadding: 2,
      lineWidth: 0.2
    },

    headStyles: {
      fillColor: [224, 242, 254],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: 0.2,
      halign: 'center',
      valign: 'middle'
    },

    bodyStyles: {
      fillColor: [255, 255, 255]
    },

    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }

  });

  // Generated date (bottom-right)
  const table = (doc as any).lastAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })}`,
    pageWidth - 14,
    table.finalY + 10,
    { align: 'right' }
  );

  doc.save('Payroll_List.pdf');
}

downloadPdf(): void {

  this.payrollService.exportPayrollPdf().subscribe({
    next: (response) => {

      const blob = response.body!;

      const contentDisposition = response.headers.get('content-disposition');

let fileName = 'Payroll_List.pdf';

if (contentDisposition) {
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match) {
    fileName = decodeURIComponent(utf8Match[1]);
  } else {
    const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
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
