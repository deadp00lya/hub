import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLogConfigurationComponent } from './event-log-configuration.component';

describe('EventLogConfigurationComponent', () => {
  let component: EventLogConfigurationComponent;
  let fixture: ComponentFixture<EventLogConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLogConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLogConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
