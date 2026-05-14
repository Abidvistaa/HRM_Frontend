import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { UserListComponent } from './components/user-list/user-list';
import { EmployeeFormComponent } from './components/employee-form/employee-form';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { SalaryFormComponent } from './components/salary-form/salary-form';
import { SalaryListComponent } from './components/salary-list/salary-list';
import { PayrollFormComponent } from './components/payroll-form/payroll-form';
import { PayrollListComponent } from './components/payroll-list/payroll-list';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'userlist', component: UserListComponent },
  { path: 'employee/create', component: EmployeeFormComponent },
  { path: 'employee/edit/:id', component: EmployeeFormComponent },
  { path: 'employeelist', component: EmployeeListComponent },
  { path: 'salary/create', component: SalaryFormComponent },
  { path: 'salary/edit/:id', component: SalaryFormComponent },
  { path: 'salarylist', component: SalaryListComponent },
  { path: 'payroll/create', component: PayrollFormComponent },
  { path: 'payroll/edit/:id', component: PayrollFormComponent },
  { path: 'payrolllist', component: PayrollListComponent },
];
