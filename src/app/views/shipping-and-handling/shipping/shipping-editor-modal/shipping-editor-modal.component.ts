/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { Shipping, EmptyShipping } from '@app/models';

import { ShippingDataViewEventType } from '../shipping-data/shipping-data-view.component';

export enum ShippingEditorModalEventType {
  CLOSE_MODAL_CLICKED = 'ShippingEditorModalComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-trade-shipping-editor-modal',
  templateUrl: './shipping-editor-modal.component.html',
})
export class ShippingEditorModalComponent implements OnChanges {

  @Input() shipping: Shipping = EmptyShipping;

  @Output() shippingEditorModalEvent = new EventEmitter<EventInfo>();

  titleText = 'Editor de envío por paquetería';

  hintText = 'Información del envío.';

  putOnPallets: boolean = false;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.setTexts();
  }


  get customers(): Identifiable[] {
    return ArrayLibrary.getUniqueItems(this.shipping.ordersForShipping.map(x => x.customer), 'uid');
  }


  get vendors(): Identifiable[] {
    return ArrayLibrary.getUniqueItems(this.shipping.ordersForShipping.map(x => x.vendor), 'uid');
  }


  onClose() {
    sendEvent(this.shippingEditorModalEvent, ShippingEditorModalEventType.CLOSE_MODAL_CLICKED);
  }


  onShippingDataViewEvent(event: EventInfo) {
    switch (event.type as ShippingDataViewEventType) {

      case ShippingDataViewEventType.SAVE_SHIPPING_CLICKED:
        Assertion.assertValue(event.payload.shippingData, 'event.payload.shippingData');
        this.messageBox.showInDevelopment('Guardar datos de envio', {
          shippingUID: this.shipping.shippingData.shippingUID,
          shippingDataFields: event.payload.shippingData,
        });
        return;

      case ShippingDataViewEventType.SEND_ORDER_CLICKED:
        this.messageBox.showInDevelopment('Enviar a embarque', event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTexts() {
    const customers = this.customers.map(x => x.name).toString();
    const vendors = this.vendors.map(x => x.name).toString();
    const date = DateStringLibrary.format(this.shipping.shippingData.shippingDate);

    this.titleText = 'Editor de envío por paquetería';
    this.hintText = `<strong>Cliente:</strong> ${customers} &nbsp; &nbsp; ` +
      `<strong>Vendedor:</strong> ${vendors}  &nbsp; &nbsp; <strong>Fecha:</strong> ${date}`;
  }

}
