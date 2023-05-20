import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvancedHomeLayoutComponent } from './advanced-home-layout.component';

describe('AdvancedHomeLayoutComponent', () => {
  let component: AdvancedHomeLayoutComponent;
  let fixture: ComponentFixture<AdvancedHomeLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedHomeLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedHomeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
