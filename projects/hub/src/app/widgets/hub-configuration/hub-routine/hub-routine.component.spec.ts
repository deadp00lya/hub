import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubRoutineComponent } from './hub-routine.component';

describe('HubRoutineComponent', () => {
  let component: HubRoutineComponent;
  let fixture: ComponentFixture<HubRoutineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubRoutineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
