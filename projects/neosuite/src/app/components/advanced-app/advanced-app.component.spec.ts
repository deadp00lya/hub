import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvancedAppComponent } from './advanced-app.component';

describe('AdvancedAppComponent', () => {
  let component: AdvancedAppComponent;
  let fixture: ComponentFixture<AdvancedAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
