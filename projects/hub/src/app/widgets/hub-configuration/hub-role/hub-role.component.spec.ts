import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PexRoleComponent } from './hub-role.component';

describe('PexRoleComponent', () => {
  let component: PexRoleComponent;
  let fixture: ComponentFixture<PexRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PexRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PexRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
