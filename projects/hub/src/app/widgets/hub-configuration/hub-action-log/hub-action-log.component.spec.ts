import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubActionLogComponent } from './hub-action-log.component';

describe('HubActionLogComponent', () => {
  let component: HubActionLogComponent;
  let fixture: ComponentFixture<HubActionLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubActionLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubActionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
