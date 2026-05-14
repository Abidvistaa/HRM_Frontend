import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PayrollService } from '../../services/payroll';
import { SalaryService } from '../../services/salary';

@Component({
  selector: 'app-payroll-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payroll-form.html',
  styleUrl: './payroll-form.css'
})
export class PayrollFormComponent implements OnInit {

  payrollForm!: FormGroup;

  isEditMode = false;

  salaries: any[] = [];

  basicSalary = 0;
  selectedSalary: any = null;

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private salaryService: SalaryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.initForm();

    // auto-recalculate on changes
    this.payrollForm.valueChanges.subscribe(() => {
      this.calculateSalary();
    });

    // dropdown change
    this.payrollForm.get('salaryId')?.valueChanges.subscribe(id => {
      this.onSalaryChange(id);
    });

    const id = this.route.snapshot.paramMap.get('id');

    // FIRST load salaries
    this.salaryService.getUpdatedSalaries().subscribe({
      next: (res) => {
        this.salaries = res;

        // AFTER salaries loaded → load payroll (edit mode safe)
        if (id) {
          this.loadPayroll(+id);
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load salaries';
      }
    });
  }

  // INIT FORM
  private initForm(): void {
    const now = new Date();

    this.payrollForm = this.fb.group({
      id: [0],
      salaryId: [null, Validators.required],
      payrollMonth: [now.getMonth() + 1, Validators.required],
      payrollYear: [now.getFullYear(), Validators.required],

      bonus: [0],
      deduction: [0],
      tax: [0, Validators.required],
      netSalary: [{ value: 0, disabled: true }]
    });
  }

  // SALARY CHANGE
  onSalaryChange(salaryId: number): void {

    const id = Number(salaryId);

    const selected = this.salaries.find(x => Number(x.id) === id);

    if (!selected) return;

    this.selectedSalary = selected;
    this.basicSalary = selected.basicSalary ?? 0;

    this.calculateSalary();
  }

  // LOAD EDIT MODE
  loadPayroll(id: number): void {

    this.payrollService.getPayroll(id).subscribe({
      next: (data) => {

        this.isEditMode = true;
  this.payrollForm.get('salaryId')?.disable();

        const salaryId = Number(data.salaryId); // IMPORTANT FIX

        this.payrollForm.patchValue({
          id: data.id,
          salaryId: salaryId,
          payrollMonth: data.payrollMonth,
          payrollYear: data.payrollYear,
          bonus: data.bonus,
          deduction: data.deduction,
          tax: data.tax
        });

        // ensure salary exists in list
        const selectedSalary = this.salaries.find(x => Number(x.id) === salaryId);

        this.selectedSalary = selectedSalary || null;
        this.basicSalary = selectedSalary?.basicSalary ?? 0;

        // force sync
        this.onSalaryChange(salaryId);
        this.calculateSalary();
      },
      error: () => {
        this.errorMessage = 'Failed to load payroll';
      }
    });
  }

  // CALCULATION
  calculateSalary(): void {

    const bonus = Number(this.payrollForm.get('bonus')?.value || 0);
    const deduction = Number(this.payrollForm.get('deduction')?.value || 0);
    const tax = Number(this.payrollForm.get('tax')?.value || 0);

    const gross = this.basicSalary + bonus - deduction;
    const taxAmount = (gross * tax) / 100;

    const net = gross - taxAmount;

    this.payrollForm.patchValue({
      netSalary: net
    }, { emitEvent: false });
  }

  // SUBMIT (UNCHANGED)
  onSubmit(): void {

    if (this.payrollForm.invalid) {
      this.payrollForm.markAllAsTouched();
      return;
    }

    const form = this.payrollForm.getRawValue();

    const salary = this.salaries.find(x => x.id === form.salaryId);

    if (!salary) {
      this.errorMessage = 'Invalid salary selected';
      return;
    }

    const payload = {
      id: form.id,
      salaryId: salary.id,
      employeeId: salary.employeeId,
      payrollMonth: form.payrollMonth,
      payrollYear: form.payrollYear,
      bonus: form.bonus,
      deduction: form.deduction,
      tax: form.tax,
      netSalary: form.netSalary
    };

    const request$ = this.isEditMode
      ? this.payrollService.updatePayroll(payload.id, payload)
      : this.payrollService.addPayroll(payload);

    request$.subscribe({
      next: (res: any) => {

        if (res?.success === false) {
          this.errorMessage = res.message;
          return;
        }

        this.successMessage = res.message;
        this.errorMessage = '';

        if (this.isEditMode) {
          this.router.navigate(['/payrolllist']);
        } else {
            const now = new Date();

            this.payrollForm.reset({
              id: 0,
              salaryId: null,
              basicSalary: 0,
              payrollMonth: now.getMonth() + 1,
              payrollYear: now.getFullYear(),
              bonus: 0,
              deduction: 0,
              tax: 0,
              netSalary: 0
            });

            this.basicSalary = 0;
            this.payrollForm.get('netSalary')?.setValue(0);
            this.selectedSalary = null;
        }

        setTimeout(() => {
          this.successMessage = '';
          this.errorMessage = '';
        }, 3000);
      },

      error: (err) => {
        this.errorMessage = err?.error?.message || 'Operation failed';
      }
    });
  }
}
