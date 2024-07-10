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

import { ProductDescriptor, ProductPresentation, PurchaseProductSelection, Vendor } from '@app/models';


export enum ProductInputEventType {
  ADD_PRODUCT_CLICKED = 'ProductInputComponent.Event.AddProductClicked',
}

@Component({
  selector: 'emp-trade-product-input',
  templateUrl: './product-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInputComponent implements OnChanges {

  @Input() product: ProductDescriptor;

  @Output() productInputEvent = new EventEmitter<EventInfo>();

  presentation: ProductPresentation = null;

  vendor: Vendor = null;

  quantity: number = null;

  price: number = null;

  weight: number = null;

  notes: string = null;

  showAllVendors: boolean = false;

  touched = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.product) {
      this.presentation = ArrayLibrary.getFirstItem(this.product.presentations) ?? null;
      this.setDefaultVendor(this.presentation);
    }
  }


  get isQuantityInvalid(): boolean {
    return this.quantity === null || this.quantity === undefined || this.quantity <= 0;
  }


  get isReady(): boolean {
    return !this.isQuantityInvalid;
  }


  onPresentationChanged(presentation: ProductPresentation) {
    this.setDefaultVendor(presentation);
  }


  onSubmitButtonClicked() {
    if (this.isReady) {

      const selection: PurchaseProductSelection  = {
        product: this.product,
        presentation: this.presentation,
        vendor: this.vendor,
        quantity: this.quantity > 0 ? this.quantity : null,
        price: this.price > 0 ? this.price : null,
        weight: this.weight > 0 ? this.weight : null,
        notes: this.notes ?? '',
      };

      sendEvent(this.productInputEvent, ProductInputEventType.ADD_PRODUCT_CLICKED, { selection });
    }

    this.touched = true;
  }


  private setDefaultVendor(presentation: ProductPresentation) {
    this.vendor = ArrayLibrary.getFirstItem(presentation?.vendors ?? []) ?? null;
  }

}
