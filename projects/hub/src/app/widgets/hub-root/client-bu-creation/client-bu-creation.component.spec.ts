import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBuCreationComponent } from './client-bu-creation.component';

describe('ClientBuCreationComponent', () => {
  let component: ClientBuCreationComponent;
  let fixture: ComponentFixture<ClientBuCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBuCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBuCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
