import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      roleId: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loadRoles();
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (res) => {
        this.roles = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onSubmit(): void {

    if (this.registerForm.invalid) {
      return;
    }

    this.userService.registerUser(this.registerForm.value).subscribe({
      next: (res) => {
        alert('User Registered Successfully');
        this.registerForm.reset();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
