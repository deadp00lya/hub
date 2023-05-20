import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PexApprovalComponent } from './approval.component';

describe('PexApprovalComponent', () => {
  let component: PexApprovalComponent;
  let fixture: ComponentFixture<PexApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PexApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PexApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
