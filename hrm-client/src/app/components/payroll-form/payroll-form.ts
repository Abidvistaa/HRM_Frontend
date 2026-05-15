import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { PayrollService } from '../../services/payroll';

@Component({
  selector: 'app-payroll-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payroll-form.html',
  styleUrl: './payroll-form.css'
})
export class PayrollFormComponent implements OnInit {

  form!: FormGroup;

  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService
  ) {}

  ngOnInit(): void {

    const now = new Date();

    this.form = this.fb.group({

      // current month selected
      payrollMonth: [
        now.getMonth() + 1,
        Validators.required
      ],

      // current year auto-filled
      payrollYear: [
        now.getFullYear(),
        Validators.required
      ],

      // default 0
      bonus: [0],

      // default 0
      deduction: [0]

    });
  }

  onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = this.form.value;

    console.log('Payroll Payload:', payload);

    this.payrollService.autoGeneratePayroll(payload).subscribe({

    next: (res: any) => {

      this.loading = false;

      if (res?.success === false) {

        this.errorMessage =
          res?.message || 'No payroll generated';

        this.successMessage = '';

      } else {

        this.successMessage =
          res?.message || 'Payroll generated successfully';

        this.errorMessage = '';
      }

      setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 3000);
    },
      error: (err) => {

        this.errorMessage =
          err?.error?.message || 'Failed to generate payroll';

        this.loading = false;

        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}
