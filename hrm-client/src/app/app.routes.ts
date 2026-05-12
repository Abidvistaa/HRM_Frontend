import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { UserListComponent } from './components/user-list/user-list';
import { EmployeeListComponent } from './components/employee-list/employee-list';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'employee-list', component: EmployeeListComponent }
];
