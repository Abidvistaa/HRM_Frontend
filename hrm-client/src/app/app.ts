import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './layout/topbar/topbar';
import { LeftbarComponent } from './layout/leftbar/leftbar';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TopbarComponent,
    LeftbarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

}
