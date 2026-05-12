import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  roles: any[] = [];

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      roleId: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  // GET ROLES
  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: () => this.errorMessage = 'Failed to load roles'
    });
  }

  // REGISTER USER
  onSubmit(): void {

  if (this.registerForm.invalid) {

    this.registerForm.markAllAsTouched();

    this.errorMessage = 'Please fill all required fields.';

    return;
  }

  this.userService.registerUser(this.registerForm.value).subscribe({
    next: () => {

      this.successMessage = 'User created successfully!';
      this.errorMessage = '';

      this.registerForm.reset();

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    },

    error: () => {

      this.errorMessage = 'Failed to create user.';

      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    }
  });
}

  resetForm(): void {
    this.registerForm.reset();
  }

  goToLoginPage() {
    this.router.navigateByUrl('');
  }

  goToUserList() {
    this.router.navigateByUrl('/user-list');
  }

}
