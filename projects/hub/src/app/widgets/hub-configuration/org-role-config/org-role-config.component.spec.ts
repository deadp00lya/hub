import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgRoleConfigComponent } from './org-role-config.component';

describe('OrgRoleConfigComponent', () => {
  let component: OrgRoleConfigComponent;
  let fixture: ComponentFixture<OrgRoleConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgRoleConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgRoleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
