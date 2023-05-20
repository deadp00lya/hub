import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PexApprovalListComponent } from './approval-list.component';

describe('PexApprovalListComponent', () => {
  let component: PexApprovalListComponent;
  let fixture: ComponentFixture<PexApprovalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PexApprovalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PexApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
