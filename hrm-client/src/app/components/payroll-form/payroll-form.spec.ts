import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollFormComponent } from './payroll-form';

describe('Register', () => {
  let component: PayrollFormComponent;
  let fixture: ComponentFixture<PayrollFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
