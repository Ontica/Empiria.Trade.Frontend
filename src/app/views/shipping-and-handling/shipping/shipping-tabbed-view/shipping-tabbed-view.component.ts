/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyShippingData, ShippingData, ShippingQueryType, ShippingStatus,
         getShippingStatusName } from '@app/models';

import { ShippingEditionEventType } from '../shipping-edition/shipping-edition.component';

export enum ShippingTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'ShippingTabbedViewComponent.Event.CloseButtonClicked',
  SHIPPING_UPDATED     = 'ShippingTabbedViewComponent.Event.ShippingUpdated',
  SHIPPING_DELETED     = 'ShippingTabbedViewComponent.Event.ShippingDeleted',
}

@Component({
  selector: 'emp-trade-shipping-tabbed-view',
  templateUrl: './shipping-tabbed-view.component.html',
})
export class ShippingTabbedViewComponent implements OnChanges {

  @Input() queryType: ShippingQueryType = ShippingQueryType.Shipping;

  @Input() shippingData: ShippingData = EmptyShippingData;

  @Output() shippingTabbedViewEvent = new EventEmitter<EventInfo>();

  titleText = 'Visor de envío';

  hintText = 'Información del envío.';


  ngOnChanges() {
    this.setTexts();
  }


  get queryTypeName(): string {
    return this.queryType === ShippingQueryType.Delivery ? 'embarque' : 'envío';
  }


  onClose() {
    sendEvent(this.shippingTabbedViewEvent, ShippingTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onShippingEditionEvent(event: EventInfo) {
    switch (event.type as ShippingEditionEventType) {
      case ShippingEditionEventType.SHIPPING_UPDATED:
      case ShippingEditionEventType.STATUS_UPDATED:
        sendEvent(this.shippingTabbedViewEvent, ShippingTabbedViewEventType.SHIPPING_UPDATED, event.payload);
        return;

      case ShippingEditionEventType.SHIPPING_DELETED:
        sendEvent(this.shippingTabbedViewEvent, ShippingTabbedViewEventType.SHIPPING_DELETED,
          { shippingUID: this.shippingData.shippingUID });
        return;

      case ShippingEditionEventType.DATA_DESCRIPTION:
        Assertion.assertValue(event.payload.description, 'event.payload.description');
        this.hintText = event.payload.description;
        return

      case ShippingEditionEventType.DATA_ERROR:
        this.onClose();
        return;


      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTexts() {
    this.titleText = `${this.shippingData.shippingID}` +
      `<span class="${this.getShippingStatusClasses()}">` +
      `${getShippingStatusName(this.shippingData.status)} </span>`;
  }


  private getShippingStatusClasses(){
    switch (this.shippingData.status) {
      case ShippingStatus.EnCaptura: return 'tag tag-small tag-base-info';
      case ShippingStatus.EnProceso: return 'tag tag-small tag-base-warning';
      case ShippingStatus.Cerrado: return 'tag tag-small tag-base-success';
      case ShippingStatus.Rechazado: return 'tag tag-small tag-base-error';
    }
  }

}
