import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingTableComponent } from './packing-items-table.component';

describe('PackingTableComponent', () => {
  let component: PackingTableComponent;
  let fixture: ComponentFixture<PackingTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackingTableComponent]
    });
    fixture = TestBed.createComponent(PackingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
