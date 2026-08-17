import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

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

@Component({
  selector: 'app-leftbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  constructor(private authService: AuthService) {}


  // ==========================================
  // YOUR EXISTING ROLE LOGIC
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

  totalEmployees = 142;

  activeEmployees = 128;

  monthlyPayroll = 3245750;



  // ==========================================
  // DEPARTMENT DATA
  // ==========================================

  departments: Department[] = [

    {
      name: 'Admin',
      count: 24,
      percentage: 16.9,
      color: '#3B82F6'
    },

    {
      name: 'HR',
      count: 18,
      percentage: 12.7,
      color: '#22C55E'
    },

    {
      name: 'Faculty',
      count: 32,
      percentage: 22.5,
      color: '#8B5CF6'
    },

    {
      name: 'SDD',
      count: 40,
      percentage: 28.2,
      color: '#F59E0B'
    },

    {
      name: 'Finance',
      count: 20,
      percentage: 14.1,
      color: '#EC4899'
    }

  ];



  // ==========================================
  // DOUGHNUT CHART
  // ==========================================

  get departmentGradient(): string {

    let currentPercentage = 0;

    const gradients: string[] = [];

    this.departments.forEach(department => {

      const start = currentPercentage;

      currentPercentage += department.percentage;

      gradients.push(
        `${department.color} ${start}% ${currentPercentage}%`
      );

    });

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


    return this.payrollValues.map((value, index) => {

      const x =
        padding +
        (index / (this.payrollValues.length - 1))
        * usableWidth;


      const y =
        chartHeight -
        (value / maxValue) * chartHeight;


      return {
        x,
        y,
        value
      };

    });

  }



  // ==========================================
  // PAYROLL LINE
  // ==========================================

  get payrollLinePoints(): string {

    return this.payrollPoints
      .map(point => `${point.x},${point.y}`)
      .join(' ');

  }



  // ==========================================
  // PAYROLL AREA
  // ==========================================

  get payrollAreaPoints(): string {

    const points = this.payrollPoints
      .map(point => `${point.x},${point.y}`)
      .join(' ');

    return `10,250 ${points} 690,250`;

  }

}
