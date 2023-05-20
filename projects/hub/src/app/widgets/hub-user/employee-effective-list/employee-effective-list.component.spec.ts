import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEffectiveListComponent } from './employee-effective-list.component';

describe('EmployeeEffectiveListComponent', () => {
  let component: EmployeeEffectiveListComponent;
  let fixture: ComponentFixture<EmployeeEffectiveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeEffectiveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEffectiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
