import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceFilterListComponent } from './advance-filter-list.component';

describe('AdvanceFilterListComponent', () => {
  let component: AdvanceFilterListComponent;
  let fixture: ComponentFixture<AdvanceFilterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceFilterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
