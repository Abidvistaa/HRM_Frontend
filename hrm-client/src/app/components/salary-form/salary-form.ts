import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SalaryService } from '../../services/salary';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-salary-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salary-form.html',
  styleUrl: './salary-form.css'
})
export class SalaryFormComponent implements OnInit {

  salaryForm!: FormGroup;
  isEditMode = false;

  employees: any[] = [];

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEmployees();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadSalary(+id);
    } else {
      this.setCreateMode();
    }
  }

  // INIT FORM
  private initForm(): void {
    this.salaryForm = this.fb.group({
      id: [0],
      employeeId: [null, Validators.required],
      basicSalary: ['', Validators.required],
      effectiveDate: ['', Validators.required]
    });
  }

  // LOAD EMPLOYEES
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (res: any) => this.employees = res
    });
  }

  // LOAD SALARY (EDIT MODE)
  loadSalary(id: number): void {
    this.salaryService.getSalary(id).subscribe({
      next: (salary: any) => {

        this.isEditMode = true;

        const formattedDate = salary.effectiveDate
          ? new Date(salary.effectiveDate).toISOString().split('T')[0]
          : '';

        this.salaryForm.patchValue({
          id: salary.id,
          employeeId: salary.employeeId,
          basicSalary: salary.basicSalary,
          effectiveDate: formattedDate
        });

        // disable employee dropdown in edit mode
        this.salaryForm.get('employeeId')?.disable();
      },
      error: () => {
        this.errorMessage = 'Failed to load salary';
        this.autoClearMessages();
      }
    });
  }

  // CREATE MODE RESET
  setCreateMode(): void {
    this.isEditMode = false;

    this.salaryForm.reset({
      id: 0,
      employeeId: null,
      basicSalary: '',
      effectiveDate: ''
    });

    this.salaryForm.get('employeeId')?.enable();
  }

  // SUBMIT
onSubmit(): void {

  if (this.salaryForm.invalid) {
    this.salaryForm.markAllAsTouched();
    return;
  }

  const payload = this.salaryForm.getRawValue();

  const request$ = this.isEditMode
    ? this.salaryService.updateSalary(payload.id, payload)
    : this.salaryService.addSalary(payload);

  request$.subscribe({
    next: () => {

      this.successMessage = this.isEditMode
        ? 'Salary updated successfully!'
        : 'Salary created successfully!';

      this.errorMessage = '';

      if (this.isEditMode) {
        // KEEP EDIT MODE BUT CLEAR FIELDS
        this.salaryForm.reset({
          id: payload.id,        // keep same record
          employeeId: payload.employeeId,
          basicSalary: '',
          effectiveDate: ''
        });
    // AFTER UPDATE → GO TO LIST
            this.router.navigate(['/salarylist']);
        // employee still disabled in edit mode
        this.salaryForm.get('employeeId')?.disable();
      }
      else {
        // CREATE MODE RESET
        this.setCreateMode();
      }

      this.autoClearMessages();
    },

    error: () => {
      this.errorMessage = 'Operation failed!';
      this.successMessage = '';
      this.autoClearMessages();
    }
  });
}

  // RESET BUTTON
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
