import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingViewComponent } from './packing-view.component';

describe('PackingViewComponent', () => {
  let component: PackingViewComponent;
  let fixture: ComponentFixture<PackingViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackingViewComponent]
    });
    fixture = TestBed.createComponent(PackingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
