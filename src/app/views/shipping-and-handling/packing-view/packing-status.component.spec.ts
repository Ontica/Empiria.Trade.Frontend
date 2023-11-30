import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingStatusComponent } from './packing-status.component';

describe('PackingStatusComponent', () => {
  let component: PackingStatusComponent;
  let fixture: ComponentFixture<PackingStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackingStatusComponent]
    });
    fixture = TestBed.createComponent(PackingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
