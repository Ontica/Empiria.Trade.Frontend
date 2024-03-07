/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ShippingEditionEventType } from '../shipping-edition/shipping-edition.component';


export enum ShippingEditorModalEventType {
  CLOSE_BUTTON_CLICKED = 'ShippingEditorModalComponent.Event.CloseButtonClicked',
  SHIPPING_UPDATED     = 'ShippingEditorModalComponent.Event.ShippingUpdated',
  SHIPPING_DELETED     = 'ShippingEditorModalComponent.Event.ShippingDeleted',
  SHIPPING_SENT        = 'ShippingEditorModalComponent.Event.ShippingSent',
}

@Component({
  selector: 'emp-trade-shipping-editor-modal',
  templateUrl: './shipping-editor-modal.component.html',
})
export class ShippingEditorModalComponent implements OnInit {

  @Input() orders: string[] = null;

  @Output() shippingEditorModalEvent = new EventEmitter<EventInfo>();

  titleText = 'Editor de envío';

  hintText = 'Información del envío.';


  ngOnInit() {
    this.setTexts()
  }


  onClose() {
    sendEvent(this.shippingEditorModalEvent, ShippingEditorModalEventType.CLOSE_BUTTON_CLICKED);
  }


  onShippingEditionEvent(event: EventInfo) {
    switch (event.type as ShippingEditionEventType) {
      case ShippingEditionEventType.SHIPPING_UPDATED:
        sendEvent(this.shippingEditorModalEvent, ShippingEditorModalEventType.SHIPPING_UPDATED, event.payload);
        return;

      case ShippingEditionEventType.SHIPPING_DELETED:
        sendEvent(this.shippingEditorModalEvent, ShippingEditorModalEventType.SHIPPING_DELETED);
        return;

      case ShippingEditionEventType.STATUS_UPDATED:
        sendEvent(this.shippingEditorModalEvent, ShippingEditorModalEventType.SHIPPING_SENT, event.payload);
        return;

      case ShippingEditionEventType.DATA_DESCRIPTION:
        Assertion.assertValue(event.payload.description, 'event.payload.description');
        this.hintText = event.payload.description;
        return

      case ShippingEditionEventType.DATA_ERROR:
        this.onClose();
        return

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTexts() {
    this.titleText = this.orders?.length > 0 ? 'Editor de envío' : 'Agregar envío';
  }

}
