import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PexListComponent } from './hub-list.component';

describe('PexListComponent', () => {
  let component: PexListComponent;
  let fixture: ComponentFixture<PexListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PexListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PexListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
