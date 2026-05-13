import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { UserListComponent } from './components/user-list/user-list';
import { EmployeeFormComponent } from './components/employee-form/employee-form';
import { EmployeeListComponent } from './components/employee-list/employee-list';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'userlist', component: UserListComponent },
  { path: 'employee/edit/:id', component: EmployeeFormComponent },
  { path: 'employee/create', component: EmployeeFormComponent },
  { path: 'employeelist', component: EmployeeListComponent },

];
