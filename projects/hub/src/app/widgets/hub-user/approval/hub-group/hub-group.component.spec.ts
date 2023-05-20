import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PexGroupComponent } from './group.component';

describe('PexGroupComponent', () => {
  let component: PexGroupComponent;
  let fixture: ComponentFixture<PexGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PexGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PexGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
