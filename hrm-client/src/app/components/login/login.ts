import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
    styleUrl: './login.css',
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {

  this.loading = true;

  this.auth.login({
    username: this.username,
    password: this.password,

  }).subscribe({
    next: (res: any) => {

      this.loading = false;

      if (res && res.success === true) {
        this.router.navigate(['/home']);
      }
      else {
        this.error = 'Invalid username or password';
      }
    },

    error: () => {
     this.loading = false;
      this.error = 'Server error. Please try again.';
    }
  });
}

   goToRegister() {
     this.router.navigateByUrl('/register');
  }
}
