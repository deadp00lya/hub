import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvancedHomeComponent } from './advanced-home.component';

describe('AdvancedHomeComponent', () => {
  let component: AdvancedHomeComponent;
  let fixture: ComponentFixture<AdvancedHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
