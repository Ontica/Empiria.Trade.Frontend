/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo} from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SalesOrdersDataService, ShippingDataService } from '@app/data-services';

import { EmptyShippingData, ShippingData, ShippingDataFields } from '@app/models';

import { ShippingDataViewEventType } from '../shipping-data/shipping-data-view.component';

export enum OrderShippingViewerEventType {
  ORDER_SHIPPING_UPDATED = 'OrderShippingViewerComponent.Event.OrderShippingUpdated',
  ORDER_SENT             = 'OrderShippingViewerComponent.Event.OrderSent',
}

@Component({
  selector: 'emp-trade-order-shipping-viewer',
  templateUrl: './order-shipping-viewer.component.html',
})
export class OrderShippingViewerComponent {

  @Input() orderUID: string = '';

  @Input() orderNumber: string = '';

  @Input() shippingData: ShippingData = EmptyShippingData;

  @Input() canEdit = false;

  @Output() orderShippingViewerEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private shippingDataService: ShippingDataService,
              private salesOrdersDataService: SalesOrdersDataService) {

  }


  get shippingDataValid(): ShippingData {
    return this.shippingData ?? EmptyShippingData;
  }


  onShippingDataViewEvent(event: EventInfo) {
    switch (event.type as ShippingDataViewEventType) {

      case ShippingDataViewEventType.SAVE_SHIPPING_CLICKED:
        Assertion.assertValue(event.payload.shippingData, 'event.payload.shippingData');
        this.updateOrderShipping(this.orderUID, event.payload.shippingData as ShippingDataFields);
        return;

      case ShippingDataViewEventType.SEND_ORDER_CLICKED:
        this.sendOrder(this.orderUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateOrderShipping(orderUID: string, shippingFields: ShippingDataFields) {
    this.submitted = true;

    this.shippingDataService.updateOrderShipping(orderUID, shippingFields)
      .firstValue()
      .then(x => sendEvent(this.orderShippingViewerEvent, OrderShippingViewerEventType.ORDER_SHIPPING_UPDATED,
                   { orderUID }))
      .finally(() => this.submitted = false);
  }


  private sendOrder(orderUID: string) {
    this.submitted = true;

    this.salesOrdersDataService.sendOrder(orderUID)
      .firstValue()
      .then(x => sendEvent(this.orderShippingViewerEvent, OrderShippingViewerEventType.ORDER_SENT,
                   { order: x }))
      .finally(() => this.submitted = false);
  }

}
