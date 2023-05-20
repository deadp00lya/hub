import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkManagerComponent } from './bulk-manager.component';

describe('BulkManagerComponent', () => {
  let component: BulkManagerComponent;
  let fixture: ComponentFixture<BulkManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
