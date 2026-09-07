import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { EmployeeService } from '../../services/employee';


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
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}


  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {

    this.loadDepartmentData();

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

  // Comes from backend
  totalEmployees: number = 0;

  // Still hardcoded for now
  activeEmployees: number = 128;

  // Still hardcoded for now
  monthlyPayroll: number = 3245750;


  // ==========================================
  // DEPARTMENT DATA
  // ==========================================

  departments: Department[] = [];


  // ==========================================
  // LOAD DEPARTMENT DATA FROM BACKEND
  // ==========================================

loadDepartmentData(): void {

  this.employeeService.getDeptEmpsForDonut().subscribe({

    next: (res) => {

      // ==========================================
      // TOTAL EMPLOYEES FROM BACKEND
      // ==========================================

      this.totalEmployees = res.data.grossTotalEmp;


      // ==========================================
      // DEPARTMENT DATA FROM BACKEND
      // ==========================================

      this.departments = res.data.departmentInfo.map(
        (department: any, index: number) => {

          const percentage =
            this.totalEmployees > 0
              ? (department.totalEmp / this.totalEmployees) * 100
              : 0;

          return {
            name: department.dept,
            count: department.totalEmp,
            percentage: Number(percentage.toFixed(1)),
            color: this.getDepartmentColor(index)
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

    // No data yet
    if (!this.departments.length) {
      return 'conic-gradient(#E5E7EB 0% 100%)';
    }


    let currentPercentage = 0;

    const gradients: string[] = [];


    this.departments.forEach(
      (department: Department) => {

        const start = currentPercentage;

        currentPercentage += department.percentage;


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

  payrollMonths = [

    'Sep 25',
    'Oct 25',
    'Nov 25',
    'Dec 25',
    'Jan 26',
    'Feb 26',
    'Mar 26',
    'Apr 26',
    'May 26',
    'Jun 26',
    'Jul 26',
    'Aug 26'

  ];


  payrollValues = [

    1800000,
    2150000,
    2500000,
    2800000,
    2400000,
    2400000,
    2850000,
    2750000,
    3000000,
    3250000,
    3650000,
    3245750

  ];


  // ==========================================
  // PAYROLL CHART POINTS
  // ==========================================

  get payrollPoints(): PayrollPoint[] {

    const maxValue = 4000000;

    const chartWidth = 700;

    const chartHeight = 250;

    const padding = 10;

    const usableWidth =
      chartWidth - (padding * 2);


    return this.payrollValues.map(
      (value, index) => {

        const x =
          padding +
          (index / (this.payrollValues.length - 1)) *
          usableWidth;


        const y =
          chartHeight -
          (value / maxValue) *
          chartHeight;


        return {

          x,
          y,
          value

        };

      }
    );

  }


  // ==========================================
  // PAYROLL LINE
  // ==========================================

  get payrollLinePoints(): string {

    return this.payrollPoints
      .map(point =>
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
        .map(point =>
          `${point.x},${point.y}`
        )
        .join(' ');


    return `10,250 ${points} 690,250`;

  }

}
