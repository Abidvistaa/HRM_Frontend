import { TestBed } from '@angular/core/testing';

import { PayrollService } from './payroll';

describe('Salary', () => {
  let service: PayrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
