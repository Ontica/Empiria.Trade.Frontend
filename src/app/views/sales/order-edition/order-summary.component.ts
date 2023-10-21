/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptyOrder, Order } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { OrderAdditionalDataComponent } from './order-additional-data.component';

export enum OrderSummaryEventType {
  CHANGE_DATA = 'OrderSummaryComponent.Event.ChangeData',
}

@Component({
  selector: 'emp-trade-order-summary',
  templateUrl: './order-summary.component.html',
})
export class OrderSummaryComponent  {

  @ViewChild('additionalData') additionalData: OrderAdditionalDataComponent;

  @Input() order: Order =EmptyOrder();

  @Input() editionMode = false;

  @Input() isSaved = false;

  @Output() orderSummaryEvent = new EventEmitter<EventInfo>();


  invalidateForm() {
    this.additionalData.invalidateForm();
  }


  onOrderAdditionalDataEvent(event: EventInfo) {
    sendEvent(this.orderSummaryEvent, OrderSummaryEventType.CHANGE_DATA, event.payload);
  }

}
