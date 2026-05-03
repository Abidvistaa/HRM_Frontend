import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { EmployeeListComponent } from './components/employee-list/employee-list';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Home page
  { path: 'employee-list', component: EmployeeListComponent }
];
