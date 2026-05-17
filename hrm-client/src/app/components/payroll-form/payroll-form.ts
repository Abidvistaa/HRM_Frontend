import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { PayrollService }
from '../../services/payroll';

@Component({
  selector: 'app-payroll-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './payroll-form.html',
  styleUrl: './payroll-form.css'
})
export class PayrollFormComponent
implements OnInit {

  form!: FormGroup;

  successMessage = '';
  errorMessage = '';

  loading = false;

  // CURRENT MONTH
  currentMonth = '';

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService
  ) {}

  ngOnInit(): void {

    const today = new Date();

    const year =
      today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0');

    // YYYY-MM
    this.currentMonth =
      `${year}-${month}`;

    this.form = this.fb.group({

      // DEFAULT CURRENT MONTH
      payrollDate: [
        this.currentMonth,
        Validators.required
      ],

      bonus: [0],

      deduction: [0]

    });
  }

  // SUBMIT
  onSubmit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.successMessage = '';

    this.errorMessage = '';

    const formValue =
      this.form.getRawValue();

    // payrollDate = "2026-05"
    const parts =
      formValue.payrollDate.split('-');

    const payload = {

      payrollYear:
        Number(parts[0]),

      payrollMonth:
        Number(parts[1]),

      bonus:
        formValue.bonus,

      deduction:
        formValue.deduction
    };

    console.log(
      'Payroll Payload:',
      payload
    );

    this.payrollService
      .autoGeneratePayroll(payload)
      .subscribe({

      // SUCCESS
      next: (res: any) => {

        this.loading = false;

        if (
          res?.success === false
        ) {

          this.errorMessage =

            res?.message ||

            'No payroll generated';

          this.successMessage = '';

        } else {

          this.successMessage =

            res?.message ||

            'Payroll generated successfully';

          this.errorMessage = '';
        }

        setTimeout(() => {

          this.successMessage = '';

          this.errorMessage = '';

        }, 3000);
      },

      // ERROR
      error: (err) => {

        this.loading = false;

        this.errorMessage =

          err?.error?.message ||

          'Failed to generate payroll';

        setTimeout(() => {

          this.errorMessage = '';

        }, 3000);
      }
    });
  }
}
