import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiMapComponent } from './api-map.component';

describe('ApiMapComponent', () => {
  let component: ApiMapComponent;
  let fixture: ComponentFixture<ApiMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
