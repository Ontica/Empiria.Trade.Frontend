import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingItemEntriesTableComponent } from './packing-item-entries-table.component';

describe('PackingItemEntriesTableComponent', () => {
  let component: PackingItemEntriesTableComponent;
  let fixture: ComponentFixture<PackingItemEntriesTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackingItemEntriesTableComponent]
    });
    fixture = TestBed.createComponent(PackingItemEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
