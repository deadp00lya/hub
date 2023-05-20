import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiregitsrationComponent } from './apiregitsration.component';

describe('ApiregitsrationComponent', () => {
  let component: ApiregitsrationComponent;
  let fixture: ComponentFixture<ApiregitsrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiregitsrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiregitsrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
