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

  // CURRENT MONTH
  currentMonth = '';

  constructor(
    private fb: FormBuilder,
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // SET CURRENT MONTH
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0');

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

      employeeId: [
        null,
        Validators.required
      ],

      basicSalary: [
        '',
        Validators.required
      ],

      effectiveDate: [
        '',
        Validators.required
      ]
    });
  }

  // LOAD ACTIVE EMPLOYEES
  loadEmployees(): void {

    this.employeeService
      .getActiveEmployees()
      .subscribe({

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

  // LOAD SALARY FOR EDIT
  loadSalary(id: number): void {

    this.salaryService
      .getSalary(id)
      .subscribe({

      next: (res: any) => {

        const salary = res.data;

        this.isEditMode = true;

        const formattedMonth =
          this.formatDateForInput(
            salary.effectiveDate
          );

        this.salaryForm.patchValue({

          id: salary.id,

          employeeId: salary.employeeId,

          basicSalary: salary.basicSalary,

          effectiveDate: formattedMonth
        });

        // DISABLE EMPLOYEE IN EDIT MODE
        this.salaryForm
          .get('employeeId')
          ?.disable();
      },

      error: (err) => {

        this.errorMessage =
          err?.error?.message ||
          'Failed to load salary';

        this.autoClearMessages();
      }
    });
  }

  // FORMAT DATE FOR MONTH INPUT
  private formatDateForInput(
    dateValue: any
  ): string {

    if (!dateValue) return '';

    // STRING DATE
    if (
      typeof dateValue === 'string' &&
      dateValue.length >= 7
    ) {

      return dateValue.substring(0, 7);
    }

    // DATE OBJECT
    const date = new Date(dateValue);

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    return `${year}-${month}`;
  }

  // CREATE MODE
// CREATE MODE
setCreateMode(): void {

  this.isEditMode = false;

  this.salaryForm.reset({

    id: 0,

    employeeId: null,

    basicSalary: '',

    // DEFAULT CURRENT MONTH
    effectiveDate: this.currentMonth
  });

  this.salaryForm
    .get('employeeId')
    ?.enable();
}

  // SUBMIT
  onSubmit(): void {

    if (this.salaryForm.invalid) {

      this.salaryForm.markAllAsTouched();

      return;
    }

    const payload =
      this.salaryForm.getRawValue();

    // CONVERT YYYY-MM → YYYY-MM-01
    if (payload.effectiveDate) {

      payload.effectiveDate =
        payload.effectiveDate + '-01';
    }

    const request$ = this.isEditMode

      ? this.salaryService
          .updateSalary(
            payload.id,
            payload
          )

      : this.salaryService
          .addSalary(payload);

    request$.subscribe({

      // SUCCESS
      next: (res: any) => {

        this.successMessage =
          res?.message ||

          (this.isEditMode

            ? 'Salary updated successfully.'

            : 'Salary created successfully.');

        this.errorMessage = '';

        // EDIT → GO TO LIST
        if (this.isEditMode) {

          this.router.navigate([
            '/salarylist'
          ]);

        } else {

          // CREATE → RESET FORM
          this.setCreateMode();
        }

        this.autoClearMessages();
      },

      // ERROR
      error: (err) => {

        console.log(
          'Backend Error:',
          err
        );

        this.errorMessage =

          err?.error?.message ||

          err?.error?.title ||

          err?.message ||

          'Operation failed!';

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
  private autoClearMessages(
    delay: number = 3000
  ): void {

    setTimeout(() => {

      this.successMessage = '';

      this.errorMessage = '';

    }, delay);
  }
}
