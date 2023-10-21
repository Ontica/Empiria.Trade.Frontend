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

import { expandCollapse } from '@app/shared/animations/animations';

import { ProductDescriptor, ProductPresentation, ProductSelection, Vendor } from '@app/models';

export enum ProductPresentationsEventType {
  ADD_PRODUCT_CLICKED = 'ProductPresentationsComponent.Event.AddProductClicked',
}

@Component({
  selector: 'emp-trade-product-presentations',
  templateUrl: './product-presentations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [expandCollapse],
})
export class ProductPresentationsComponent implements OnChanges {

  @Input() product: ProductDescriptor;

  @Input() selectable = false;

  @Output() productPresentationsEvent = new EventEmitter<EventInfo>();

  presentation: ProductPresentation = null;

  vendor: Vendor = null;

  quantity: number = null;

  showAllVendors: boolean = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.product) {
      this.presentation = ArrayLibrary.getFirstItem(this.product.presentations) ?? null;
      this.vendor = ArrayLibrary.getFirstItem(this.presentation.vendors ?? []);
    }
  }


  get stock(): number {
    return this.vendor.stock ?? 0;
  }


  get isQuantityInvalid(): boolean {
    return this.quantityHasValue && (this.quantity <= 0 || this.quantity > this.stock);
  }


  get quantityHasValue(): boolean {
    return this.quantity !== null && this.quantity !== undefined;
  }


  onAddProductClicked() {
    if (this.quantityHasValue && !this.isQuantityInvalid) {

      const selection: ProductSelection = {
        product: this.product,
        vendor: this.vendor,
        presentation: this.presentation,
        quantity: this.quantity,
      };

      sendEvent(this.productPresentationsEvent,
        ProductPresentationsEventType.ADD_PRODUCT_CLICKED, { selection });

      this.quantity = null;
    }
  }


  onPresentationChanges(presentation: ProductPresentation) {
    this.showAllVendors = false;
    this.vendor = presentation.vendors.length > 0 ? presentation.vendors[0] : null;
  }

}
