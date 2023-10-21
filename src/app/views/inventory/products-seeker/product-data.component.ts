/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ProductDescriptor } from '@app/models';

export enum ProductDataEventType {
  SELECT_PRODUCT_CLICKED = 'ProductDataComponent.Event.SelectProductClicked',
}

@Component({
  selector: 'emp-trade-product-data',
  templateUrl: './product-data.component.html',
})
export class ProductDataComponent {

  @Input() product: ProductDescriptor;

  @Output() productDataEvent = new EventEmitter<EventInfo>();


  onSelectProductClicked(product: ProductDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.productDataEvent, ProductDataEventType.SELECT_PRODUCT_CLICKED, { product });
    }
  }

}
