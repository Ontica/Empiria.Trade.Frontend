/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyShippingData, ShippingData } from '@app/models';

import { ShippingEditionEventType } from '../shipping-edition/shipping-edition.component';

export enum ShippingTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'ShippingTabbedViewComponent.Event.CloseButtonClicked',
  SHIPPING_UPDATED     = 'ShippingTabbedViewComponent.Event.ShippingUpdated',
}

@Component({
  selector: 'emp-trade-shipping-tabbed-view',
  templateUrl: './shipping-tabbed-view.component.html',
})
export class ShippingTabbedViewComponent implements OnInit {

  @Input() shippingData: ShippingData = EmptyShippingData;

  @Output() shippingTabbedViewEvent = new EventEmitter<EventInfo>();

  titleText = 'Visor de envío por paquetería';

  hintText = 'Información del envío.';


  ngOnInit() {
    this.setTexts();
  }


  onClose() {
    sendEvent(this.shippingTabbedViewEvent, ShippingTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onShippingEditionEvent(event: EventInfo) {
    switch (event.type as ShippingEditionEventType) {
      case ShippingEditionEventType.SHIPPING_UPDATED:
      case ShippingEditionEventType.SHIPPING_SENT:
        sendEvent(this.shippingTabbedViewEvent, ShippingTabbedViewEventType.SHIPPING_UPDATED, event.payload);
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
    // const customers = this.customers.map(x => x.name).toString();
    // const vendors = this.vendors.map(x => x.name).toString();
    // const date = DateStringLibrary.format(this.shipping.shippingData.shippingDate, 'DMY HH:mm');

    // this.titleText = this.isSaved ? 'Editor de envío por paquetería' : 'Agregar envío por paquetería';

    // if (this.shipping.ordersForShipping.length > 0) {
    //   this.hintText = `<strong>Cliente:</strong> ${customers} &nbsp; &nbsp; ` +
    //     `<strong>Vendedor:</strong> ${vendors}  &nbsp; &nbsp; <strong>Fecha:</strong> ${date}`;
    // } else{
    //   this.hintText = 'Información del envío.';
    // }
    this.titleText = `${this.shippingData.parcelSupplier.name} - ${this.shippingData.shippingGuide} ` +
      `<span class="tag tag-small"> ${this.shippingData.status ? 'Abierto' : 'Cerrado'} </span>`;
  }

}
