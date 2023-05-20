import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PexEventComponent } from './hub-event.component';

describe('PexEventComponent', () => {
  let component: PexEventComponent;
  let fixture: ComponentFixture<PexEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PexEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PexEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
