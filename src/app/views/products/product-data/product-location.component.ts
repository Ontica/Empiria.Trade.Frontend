/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output,
         SimpleChanges } from '@angular/core';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { InventoryProductSelection, ProductDescriptor, ProductPresentation, Vendor } from '@app/models';


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

  @Output() productLocationEvent = new EventEmitter<EventInfo>();

  warehouseBinAPI = SearcherAPIS.warehouseBin;

  presentation: ProductPresentation = null;

  vendor: Vendor = null;

  warehouseBin: Identifiable = null;

  quantity: number = null;

  notes: string = null;

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


  get isWarehouseBinInvalid(): boolean {
    return isEmpty(this.warehouseBin);
  }


  get isReady(): boolean {
    return !this.isWarehouseBinInvalid && !this.isQuantityInvalid;
  }


  onSubmitButtonClicked() {
    if (this.isReady) {

      const selection: InventoryProductSelection = {
        product: this.product,
        presentation: this.presentation,
        vendor: this.vendor,
        warehouseBin: this.warehouseBin,
        quantity: this.quantity,
        notes: this.notes ?? '',
      };

      sendEvent(this.productLocationEvent, ProductLocationEventType.ADD_PRODUCT_CLICKED, { selection });
    }

    this.touched = true;
  }


  onQuantityEnter(quantity: number) {
    this.quantity = quantity;
    setTimeout(() => this.onSubmitButtonClicked());
  }

}
