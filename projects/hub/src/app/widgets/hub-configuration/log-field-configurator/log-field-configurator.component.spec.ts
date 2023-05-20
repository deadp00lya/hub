import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogFieldConfiguratorComponent } from './log-field-configurator.component';

describe('LogFieldConfiguratorComponent', () => {
  let component: LogFieldConfiguratorComponent;
  let fixture: ComponentFixture<LogFieldConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogFieldConfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogFieldConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
