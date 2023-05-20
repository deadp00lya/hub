import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubAuditComponent } from './hub-audit.component';

describe('HubAuditComponent', () => {
  let component: HubAuditComponent;
  let fixture: ComponentFixture<HubAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
