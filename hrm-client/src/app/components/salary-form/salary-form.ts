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

  currentMonth = '';

  constructor(
    private fb: FormBuilder,
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // CURRENT MONTH (YYYY-MM)
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    this.currentMonth = `${year}-${month}`;

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

    this.employeeService.getActiveEmployees().subscribe({

      next: (res: any) => {
        this.employees = res.data;
      },

      error: (err) => {

        this.errorMessage =
          err?.error?.message ||
          'Failed to load employees';

        this.autoClearMessages();
      }
    });
  }

  // LOAD SALARY (EDIT)
  loadSalary(id: number): void {

    this.salaryService.getSalary(id).subscribe({

      next: (res: any) => {

        const salary = res.data;

        this.isEditMode = true;

        const formattedMonth =
          this.formatDateForInput(salary.effectiveDate);

        this.salaryForm.patchValue({

          id: salary.id,
          employeeId: salary.employeeId,
          basicSalary: salary.basicSalary,
          effectiveDate: formattedMonth
        });

        this.salaryForm.get('employeeId')?.disable();
      },

      error: (err) => {

        this.errorMessage =
          err?.error?.message ||
          'Failed to load salary';

        this.autoClearMessages();
      }
    });
  }

  // FORMAT YYYY-MM
  private formatDateForInput(dateValue: any): string {

    if (!dateValue) return '';

    if (
      typeof dateValue === 'string' &&
      dateValue.length >= 7
    ) {
      return dateValue.substring(0, 7);
    }

    const date = new Date(dateValue);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }

  // CREATE MODE
  setCreateMode(): void {

    this.isEditMode = false;

    this.salaryForm.reset({

      id: 0,
      employeeId: null,
      basicSalary: '',
      effectiveDate: this.currentMonth
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

    // convert YYYY-MM → YYYY-MM-01
    if (payload.effectiveDate) {
      payload.effectiveDate =
        payload.effectiveDate + '-01';
    }

    const request$ = this.isEditMode
      ? this.salaryService.updateSalary(payload.id, payload)
      : this.salaryService.addSalary(payload);

    request$.subscribe({

      // SUCCESS
      next: (res: any) => {

        this.successMessage =
          res?.message ||
          (this.isEditMode
            ? 'Salary updated successfully.'
            : 'Salary created successfully.');

        this.errorMessage = '';

        if (this.isEditMode) {

          this.router.navigate(['/salarylist']);

        } else {

          this.setCreateMode();
        }

        this.autoClearMessages();
      },

      // ERROR (IMPORTANT FIX)
      error: (err) => {

        console.log('Backend Error:', err);

        this.errorMessage =
          err?.error?.message ||  
          err?.message ||
          'Operation failed!';

        this.successMessage = '';

        this.autoClearMessages();
      }
    });
  }

  // RESET
  resetForm(): void {
    this.setCreateMode();
  }

  // AUTO CLEAR
  private autoClearMessages(delay: number = 3000): void {

    setTimeout(() => {

      this.successMessage = '';
      this.errorMessage = '';

    }, delay);
  }
}
