import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostUrlComponent } from './host-url.component';

describe('HostUrlComponent', () => {
  let component: HostUrlComponent;
  let fixture: ComponentFixture<HostUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
