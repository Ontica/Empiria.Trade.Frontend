/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyShipping, Shipping } from '@app/models';

export enum ShippingOrdersResumeEventType {
  SHOW_DETAIL_CLICKED = 'ShippingOrdersResumeComponent.Event.ShowDetailClicked',
}

@Component({
  selector: 'emp-trade-shipping-orders-resume',
  templateUrl: './shipping-orders-resume.component.html',
})
export class ShippingOrdersResumeComponent {

  @Input() shipping: Shipping = EmptyShipping;

  @Output() shippingOrdersResumeEvent = new EventEmitter<EventInfo>();


  onShowDetailClicked() {
    sendEvent(this.shippingOrdersResumeEvent, ShippingOrdersResumeEventType.SHOW_DETAIL_CLICKED);
  }

}
