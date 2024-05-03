/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output,
         SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { InventoryProductSelection, ProductDescriptor, ProductPresentation, Vendor,
         WarehouseBinForInventory } from '@app/models';


export enum ProductLocationEventType {
  ADD_PRODUCT_CLICKED = 'ProductLocationComponent.Event.AddProductClicked',
}

@Component({
  selector: 'emp-trade-product-location',
  templateUrl: './product-location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLocationComponent implements OnChanges {

  @Input() product: ProductDescriptor;

  @Input() warehouseBinsList: WarehouseBinForInventory[] = [];

  @Output() productLocationEvent = new EventEmitter<EventInfo>();

  positionsList: number[] = [];

  levelsList: number[] = [];

  presentation: ProductPresentation = null;

  vendor: Vendor = null;

  warehouseBin: WarehouseBinForInventory = null;

  position = null;

  level = null;

  quantity: number = null;

  showAllVendors: boolean = false;

  touched = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.product) {
      this.presentation = ArrayLibrary.getFirstItem(this.product.presentations) ?? null;
      this.vendor = ArrayLibrary.getFirstItem(this.presentation?.vendors ?? []) ?? null;
    }
  }


  get isQuantityInvalid(): boolean {
    return this.quantity === null || this.quantity === undefined || this.quantity <= 0;
  }


  get isProductValid(): boolean {
    return this.warehouseBin && this.position && this.level && !this.isQuantityInvalid;
  }


  onWarehouseBinChanges(warehouseBin: WarehouseBinForInventory) {
    this.positionsList = warehouseBin.positions;
    this.levelsList = warehouseBin.levels;

    this.position = null;
    this.level = null;
  }


  onAddProductClicked() {
    if (this.isProductValid) {

      const selection: InventoryProductSelection = {
        product: this.product,
        presentation: this.presentation,
        vendor: this.vendor,
        warehouseBin: this.warehouseBin,
        position: this.position,
        level: this.level,
        quantity: this.quantity,
        notes: '',
      };

      sendEvent(this.productLocationEvent,
        ProductLocationEventType.ADD_PRODUCT_CLICKED, { selection });

      this.quantity = null;
    }

    this.touched = true;
  }


  onQuantityEnter(quantity: number) {
    this.quantity = quantity;
    setTimeout(() => this.onAddProductClicked());
  }

}
