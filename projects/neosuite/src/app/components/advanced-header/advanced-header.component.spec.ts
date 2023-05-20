import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvancedHeaderComponent } from './advanced-header.component';

describe('AdvancedHeaderComponent', () => {
  let component: AdvancedHeaderComponent;
  let fixture: ComponentFixture<AdvancedHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
