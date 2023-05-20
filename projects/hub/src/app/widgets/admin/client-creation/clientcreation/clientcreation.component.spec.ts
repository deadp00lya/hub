import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientcreationComponent } from './clientcreation.component';

describe('ClientcreationComponent', () => {
  let component: ClientcreationComponent;
  let fixture: ComponentFixture<ClientcreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientcreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientcreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
