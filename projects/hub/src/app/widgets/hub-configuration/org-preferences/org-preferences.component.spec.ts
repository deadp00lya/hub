import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('OrgPrefrencesComponent', () => {
  let component: OrgPreferencesComponent;
  let fixture: ComponentFixture<OrgPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
