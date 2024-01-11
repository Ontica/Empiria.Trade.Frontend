/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SalesOrdersDataService, ShippingDataService } from '@app/data-services';

import { EmptyShipping, Shipping, ShippingFields } from '@app/models';

import { ShippingEditorEventType } from './shipping-editor.component';


export enum ShippingViewEventType {
  ORDER_SHIPPING_UPDATED = 'ShippingViewComponent.Event.OrderShippingUpdated',
  ORDER_SENT             = 'ShippingViewComponent.Event.OrderSent',
}

@Component({
  selector: 'emp-trade-shipping-view',
  templateUrl: './shipping-view.component.html',
})
export class ShippingViewComponent {

  @Input() orderUID: string = '';

  @Input() orderNumber: string = '';

  @Input() shipping: Shipping = EmptyShipping;

  @Input() canEdit = false;

  // @Input() canSendOrder = false;

  @Output() shippingViewEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private shippingData: ShippingDataService,
              private ordersData: SalesOrdersDataService) {

  }


  get shippingValid(): Shipping {
    return this.shipping ?? EmptyShipping;
  }


  onShippingEditorEvent(event: EventInfo) {
    switch (event.type as ShippingEditorEventType) {

      case ShippingEditorEventType.UPDATE_SHIPPING_CLICKED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.shipping, 'event.payload.shipping');
        this.updateOrderShipping(event.payload.orderUID, event.payload.shipping as ShippingFields);
        return;

      case ShippingEditorEventType.SEND_ORDER_CLICKED:
        this.sendOrder(this.orderUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateOrderShipping(orderUID: string, shippingFields: ShippingFields) {
    this.submitted = true;

    this.shippingData.updateOrderShipping(orderUID, shippingFields)
      .firstValue()
      .then(x => sendEvent(this.shippingViewEvent, ShippingViewEventType.ORDER_SHIPPING_UPDATED, {orderUID}))
      .finally(() => this.submitted = false);
  }


  private sendOrder(orderUID: string) {
    this.submitted = true;

    this.ordersData.sendOrder(orderUID)
      .firstValue()
      .then(x => sendEvent(this.shippingViewEvent, ShippingViewEventType.ORDER_SENT, { order: x }))
      .finally(() => this.submitted = false);
  }

}
