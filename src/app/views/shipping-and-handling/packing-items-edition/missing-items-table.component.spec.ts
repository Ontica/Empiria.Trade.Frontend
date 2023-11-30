import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingItemsTableComponent } from './missing-items-table.component';

describe('MissingItemsTableComponent', () => {
  let component: MissingItemsTableComponent;
  let fixture: ComponentFixture<MissingItemsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissingItemsTableComponent]
    });
    fixture = TestBed.createComponent(MissingItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
