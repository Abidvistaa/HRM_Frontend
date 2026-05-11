import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'employee-list', component: EmployeeListComponent }
];
