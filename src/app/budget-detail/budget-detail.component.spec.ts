import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDetailComponent } from './budget-detail.component';

describe('BudgetDetailComponent', () => {
  let component: BudgetDetailComponent;
  let fixture: ComponentFixture<BudgetDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BudgetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
