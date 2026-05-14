import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-leftbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leftbar.html',
  styleUrl: './leftbar.css'
})
export class LeftbarComponent {

  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

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
}
