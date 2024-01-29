/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptyShipping, Shipping } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum ShippingOrdersModalEventType {
  CLOSE_MODAL_CLICKED = 'ShippingOrdersModalComponent.Event.CloseEditorClicked',
}

@Component({
  selector: 'emp-trade-shipping-orders-modal',
  templateUrl: './shipping-orders-modal.component.html',
})
export class ShippingOrdersModalComponent {

  @Input() shipping: Shipping = EmptyShipping;

  @Output() shippingOrdersModalEvent = new EventEmitter<EventInfo>();


  onClose() {
    sendEvent(this.shippingOrdersModalEvent, ShippingOrdersModalEventType.CLOSE_MODAL_CLICKED);
  }

}
