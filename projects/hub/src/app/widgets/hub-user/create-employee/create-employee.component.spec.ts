import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PexCreateEmployeeComponent } from './create-employee.component';

describe('PexCreateEmployeeComponent', () => {
  let component: PexCreateEmployeeComponent;
  let fixture: ComponentFixture<PexCreateEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PexCreateEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PexCreateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
