import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeFormComponent implements OnInit {

  employeeForm!: FormGroup;

  isEditMode = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadEmployee(+id);
    } else {
      this.setCreateMode();
    }
  }

  // INIT FORM
  private initForm(): void {

    this.employeeForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      accountNumber: ['', Validators.required],
      employmentStatus: ['Active', Validators.required],
      hireDate: ['', Validators.required]
    });
  }

  // CREATE MODE
  setCreateMode(): void {

    this.isEditMode = false;

    this.employeeForm.reset({
      id: 0,
      name: '',
      email: '',
      phone: '',
      department: '',
      accountNumber: '',
      employmentStatus: 'Active',
      hireDate: ''
    });

    this.employeeForm.get('hireDate')?.enable();
  }

  // LOAD EMPLOYEE
  loadEmployee(id: number): void {

    this.employeeService.getEmployee(id).subscribe({

      next: (emp: any) => {

        this.isEditMode = true;

        const formattedDate = emp.hireDate
          ? new Date(emp.hireDate).toISOString().split('T')[0]
          : '';

        this.employeeForm.patchValue({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          accountNumber: emp.accountNumber,
          employmentStatus: emp.employmentStatus,
          hireDate: formattedDate
        });

        // Disable hire date in edit mode
        this.employeeForm.get('hireDate')?.disable();
      },

      error: (err) => {

        this.errorMessage =
          err?.error?.message ||
          err?.error?.title ||
          'Failed to load employee';

        this.autoClearMessages();
      }
    });
  }

  // SUBMIT
  onSubmit(): void {

    if (this.employeeForm.invalid) {

      this.employeeForm.markAllAsTouched();
      return;
    }

    const payload = this.employeeForm.getRawValue();

    // DO NOT SEND HIREDATE IN EDIT MODE
    if (this.isEditMode) {
      delete payload.hireDate;
    }

    const request$ = this.isEditMode
      ? this.employeeService.updateEmployee(payload.id, payload)
      : this.employeeService.addEmployee(payload);

    request$.subscribe({

      // SUCCESS
      next: (res: any) => {

        this.successMessage =
          res?.message ||
          (this.isEditMode
            ? 'Employee updated successfully'
            : 'Employee created successfully');

        this.errorMessage = '';

        this.autoClearMessages();

        // UPDATE MODE → NAVIGATE TO LIST
        if (this.isEditMode) {

          this.router.navigate(['/employeelist']);
          return;
        }

        // CREATE MODE → RESET FORM
        this.setCreateMode();
      },

      // ERROR
      error: (err) => {

        console.log('Backend Error:', err);

        this.errorMessage =
          err?.error?.message ||
          err?.error?.title ||
          err?.message ||
          'Something went wrong';

        this.successMessage = '';

        this.autoClearMessages();
      }
    });
  }

  // RESET FORM
  resetForm(): void {

    this.setCreateMode();
  }

  // AUTO CLEAR MESSAGES
  private autoClearMessages(delay: number = 3000): void {

    setTimeout(() => {

      this.successMessage = '';
      this.errorMessage = '';

    }, delay);
  }
}
