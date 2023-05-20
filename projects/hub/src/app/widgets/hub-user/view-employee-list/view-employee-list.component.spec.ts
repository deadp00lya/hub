import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PexViewEmployeeListComponent } from './view-employee-list.component';

describe('PexViewEmployeeListComponent', () => {
  let component: PexViewEmployeeListComponent;
  let fixture: ComponentFixture<PexViewEmployeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PexViewEmployeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PexViewEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
