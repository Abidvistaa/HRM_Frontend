import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { EmployeeService } from '../../services/employee';
import { PayrollService } from '../../services/payroll';

// ==========================================
// INTERFACES
// ==========================================

interface Department {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface PayrollPoint {
  x: number;
  y: number;
  value: number;
  month: string;
}

// ==========================================
// COMPONENT
// ==========================================

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  // ==========================================
  // HOVER
  // ==========================================

  hoveredPayrollIndex: number | null = null;

  showPayrollTooltip(index: number): void {
    this.hoveredPayrollIndex = index;
  }

  hidePayrollTooltip(): void {
    this.hoveredPayrollIndex = null;
  }

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private router: Router
  ) {}

  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {
    this.loadDepartmentData();
    this.loadPayrollData();
  }

  // ==========================================
  // ROLE LOGIC
  // ==========================================

  get role(): string {
    return this.authService.getRolename();
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  isHR(): boolean {
    return this.role === 'HR';
  }

  isFinance(): boolean {
    return this.role === 'Finance';
  }

  // ==========================================
  // DASHBOARD SUMMARY
  // ==========================================

  totalEmployees: number = 0;
  activeEmployees: number = 128;
  monthlyPayroll: number = 0;

  // ==========================================
  // DEPARTMENT DATA
  // ==========================================

  departments: Department[] = [];

  // ==========================================
  // LOAD DEPARTMENT DATA
  // ==========================================

  loadDepartmentData(): void {
    this.employeeService.getDeptEmpsForDonut().subscribe({
      next: (res) => {
        this.totalEmployees = res.data.grossTotalEmp;

        this.departments =
          res.data.departmentInfo.map(
            (department: any, index: number) => {
              const percentage =
                this.totalEmployees > 0
                  ? (department.totalEmp / this.totalEmployees) * 100
                  : 0;

              return {
                name: department.dept,
                count: department.totalEmp,
                percentage:
                  Number(percentage.toFixed(1)),
                color:
                  this.getDepartmentColor(index)
              };
            }
          );
      },
      error: (err) => {
        console.error(
          'Failed to load department data:',
          err
        );
      }
    });
  }

  // ==========================================
  // DEPARTMENT COLORS
  // ==========================================

  getDepartmentColor(index: number): string {
    const colors = [
      '#3B82F6',
      '#22C55E',
      '#8B5CF6',
      '#F59E0B',
      '#EC4899',
      '#06B6D4',
      '#EF4444',
      '#84CC16'
    ];

    return colors[index % colors.length];
  }

  // ==========================================
  // DOUGHNUT CHART
  // ==========================================

  get departmentGradient(): string {
    if (!this.departments.length) {
      return 'conic-gradient(#E5E7EB 0% 100%)';
    }

    let currentPercentage = 0;
    const gradients: string[] = [];

    this.departments.forEach(
      (department: Department) => {
        const start =
          currentPercentage;

        currentPercentage +=
          department.percentage;

        gradients.push(
          `${department.color} ${start}% ${currentPercentage}%`
        );
      }
    );

    return `conic-gradient(${gradients.join(', ')})`;
  }

  // ==========================================
  // PAYROLL DATA
  // ==========================================

  payrollMonths: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  payrollValues: number[] =
    Array(12).fill(0);

  // ==========================================
  // LOAD PAYROLL DATA
  // ==========================================

  loadPayrollData(): void {
    this.payrollService.getMonthlyAmounts().subscribe({
      next: (res) => {
        const monthlyInfo =
          res?.data?.monthlyChartInfo ?? [];

        // ======================================
        // GET MONTHLY VALUES
        // ======================================

        this.payrollValues =
          this.payrollMonths.map(month => {
            const found =
              monthlyInfo.find(
                (item: any) =>
                  item.month?.toLowerCase() ===
                  month.toLowerCase()
              );

            return found
              ? Number(found.totalAmount) || 0
              : 0;
          });

        // ======================================
        // CURRENT MONTH PAYROLL
        // ======================================

        const currentMonth =
          new Date().toLocaleString(
            'en-US',
            {
              month: 'short'
            }
          );

        const currentIndex =
          this.payrollMonths.findIndex(
            month =>
              month === currentMonth
          );

        this.monthlyPayroll =
          currentIndex >= 0
            ? this.payrollValues[currentIndex]
            : 0;
      },
      error: (err) => {
        console.error(
          'Failed to load payroll data:',
          err
        );

        this.payrollValues =
          Array(12).fill(0);

        this.monthlyPayroll = 0;
      }
    });
  }

  // ==========================================
  // DYNAMIC Y AXIS
  // ==========================================

  get payrollMaxValue(): number {
    const max =
      Math.max(
        ...this.payrollValues,
        0
      );

    if (max <= 0) {
      return 4;
    }

    // Round maximum to a clean value
    const magnitude =
      Math.pow(
        10,
        Math.floor(
          Math.log10(max)
        )
      );

    const normalized =
      max / magnitude;

    let niceMax: number;

    if (normalized <= 1) {
      niceMax = 1;
    }
    else if (normalized <= 2) {
      niceMax = 2;
    }
    else if (normalized <= 3) {
      niceMax = 3;
    }
    else {
      niceMax = 4;
    }

    return niceMax * magnitude;
  }

  // ==========================================
  // Y AXIS LABELS
  // 5 labels = 4 horizontal intervals
  // ==========================================

  get payrollYAxisLabels(): number[] {
    const max =
      this.payrollMaxValue;

    return [
      max,
      max * 0.75,
      max * 0.50,
      max * 0.25,
      0
    ];
  }

  // ==========================================
  // FORMAT PAYROLL AMOUNT
  // ==========================================

  formatPayrollAmount(value: number): string {
    return `৳ ${value.toLocaleString(
      'en-US',
      {
        maximumFractionDigits: 0
      }
    )}`;
  }

  // ==========================================
  // PAYROLL CHART POINTS
  // ==========================================

  get payrollPoints(): PayrollPoint[] {
    const maxValue =
      this.payrollMaxValue;

    const chartWidth = 700;
    const chartHeight = 215;
    const padding = 10;

    const usableWidth =
      chartWidth -
      (padding * 2);

    return this.payrollValues.map(
      (value, index) => {

        const x =
          this.payrollValues.length === 1
            ? chartWidth / 2
            : padding +
              (
                index /
                (this.payrollValues.length - 1)
              ) *
              usableWidth;

        const y =
          chartHeight -
          (
            value /
            maxValue
          ) *
          chartHeight;

        return {
          x,
          y,
          value,
          month:
            this.payrollMonths[index]
        };
      }
    );
  }

  // ==========================================
  // PAYROLL LINE
  // ==========================================

  get payrollLinePoints(): string {
    return this.payrollPoints
      .map(
        point =>
          `${point.x},${point.y}`
      )
      .join(' ');
  }

  // ==========================================
  // PAYROLL AREA
  // ==========================================

  get payrollAreaPoints(): string {
    const points =
      this.payrollPoints
        .map(
          point =>
            `${point.x},${point.y}`
        )
        .join(' ');

    return `10,215 ${points} 690,215`;
  }

  // ==========================================
  // TOOLTIP LEFT POSITION
  // ==========================================

  getTooltipLeft(): number {
    if (
      this.hoveredPayrollIndex === null
    ) {
      return 0;
    }

    const point =
      this.payrollPoints[
        this.hoveredPayrollIndex
      ];

    let left =
      (
        point.x /
        700
      ) * 100;

    // Prevent overflow on left
    if (left < 10) {
      left = 10;
    }

    // Prevent overflow on right
    if (left > 90) {
      left = 90;
    }

    return left;
  }

  // ==========================================
  // TOOLTIP TOP POSITION
  // ==========================================

  getTooltipTop(): number {
    if (
      this.hoveredPayrollIndex === null
    ) {
      return 0;
    }

    const point =
      this.payrollPoints[
        this.hoveredPayrollIndex
      ];

    let top =
      point.y - 65;

    // If point is near the top,
    // show tooltip below point
    if (top < 5) {
      top =
        point.y + 15;
    }

    return top;
  }

}
