import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrdersFilterComponent } from './inventory-orders-filter.component';

describe('InventoryOrdersFilterComponent', () => {
  let component: InventoryOrdersFilterComponent;
  let fixture: ComponentFixture<InventoryOrdersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOrdersFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryOrdersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
