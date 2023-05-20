import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PexPrefrencesComponent } from './hub-prefrences.component';

describe('PexPrefrencesComponent', () => {
  let component: PexPrefrencesComponent;
  let fixture: ComponentFixture<PexPrefrencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PexPrefrencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PexPrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
