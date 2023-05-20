import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeoConfigViewComponent } from './neo-config-view.component';

describe('NeoConfigViewComponent', () => {
  let component: NeoConfigViewComponent;
  let fixture: ComponentFixture<NeoConfigViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeoConfigViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeoConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
