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

import { ShippingDataService } from '@app/data-services';

import { Shipping, EmptyShipping, ShippingQuery, ShippingFields, ShippingDataFields } from '@app/models';

import { ShippingDataViewEventType } from '../shipping-data/shipping-data-view.component';

import { ShippingOrdersResumeEventType } from '../shipping-data/shipping-orders-resume.component';

import { ShippingOrdersModalEventType } from '../shipping-data/shipping-orders-modal.component';

export enum ShippingEditorEventType {
  CLOSE_BUTTON_CLICKED = 'ShippingEditorComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-trade-shipping-editor',
  templateUrl: './shipping-editor.component.html',
})
export class ShippingEditorComponent implements OnChanges {

  @Input() orders: string[] = [];

  @Output() shippingEditorEvent = new EventEmitter<EventInfo>();

  isLoading = false;

  submitted = false;

  titleText = 'Editor de envío por paquetería';

  hintText = 'Información del envío.';

  putOnPallets: boolean = false;

  shipping: Shipping = EmptyShipping;

  displayShippingOrdersModal = false;


  constructor(private shippingData: ShippingDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.loadInitData();
  }


  get customers(): Identifiable[] {
    return ArrayLibrary.getUniqueItems(this.shipping.ordersForShipping.map(x => x.customer), 'uid');
  }


  get vendors(): Identifiable[] {
    return ArrayLibrary.getUniqueItems(this.shipping.ordersForShipping.map(x => x.vendor), 'uid');
  }


  onClose() {
    sendEvent(this.shippingEditorEvent, ShippingEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onShippingOrdersResumeEvent(event: EventInfo) {
    switch (event.type as ShippingOrdersResumeEventType) {

      case ShippingOrdersResumeEventType.SHOW_DETAIL_CLICKED:
        this.displayShippingOrdersModal = true;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }


  onShippingDataViewEvent(event: EventInfo) {
    switch (event.type as ShippingDataViewEventType) {

      case ShippingDataViewEventType.SAVE_SHIPPING_CLICKED:
        Assertion.assertValue(event.payload.shippingDataFields, 'event.payload.shippingDataFields');

        const shippingFields: ShippingFields = {
          shippingData: event.payload.shippingDataFields as ShippingDataFields,
          orders: this.orders,
        };

        this.validateSaveShippingToExecute(shippingFields);
        return;

      case ShippingDataViewEventType.SEND_ORDER_CLICKED:
        this.messageBox.showInDevelopment('Enviar a embarque', event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingOrdersModalEvent(event: EventInfo) {
    switch (event.type as ShippingOrdersModalEventType) {
      case ShippingOrdersModalEventType.CLOSE_MODAL_CLICKED:
        this.displayShippingOrdersModal = false;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private loadInitData() {
    if (this.orders.length > 0) {
      const query: ShippingQuery = {orders: this.orders};
      this.getShippingByOrders(query);
    } else {
      this.messageBox.showError('No se han proporcionado datos validos.');
      this.resolveShippingError();
    }
  }


  private getShippingByOrders(query: ShippingQuery) {
    this.isLoading = true;

    this.shippingData.getShippingByOrders(query)
      .firstValue()
      .then(x => this.setShipping(x))
      .catch(x => this.resolveShippingError())
      .finally(() => this.isLoading = false);
  }


  private createShipping(shippingFields: ShippingFields) {
    this.submitted = true;

    this.shippingData.createShipping(shippingFields)
      .firstValue()
      .then(x => this.resolveShippingSaved(x))
      .finally(() => this.submitted = false);
  }


  private updateShipping(shippingUID: string, shippingFields: ShippingFields) {
    this.submitted = true;

    this.shippingData.updateShipping(shippingUID, shippingFields)
      .firstValue()
      .then(x => this.resolveShippingSaved(x))
      .finally(() => this.submitted = false);
  }


  private setShipping(shipping: Shipping) {
    this.shipping = shipping;
    this.setTexts();
  }


  private resolveShippingSaved(shipping: Shipping) {
    this.setShipping(shipping);
    this.messageBox.show('La infomación del envio fue guardada correctamente.', 'Guardar datos de envío');
  }


  private resolveShippingError() {
    this.onClose();
  }


  private validateSaveShippingToExecute(shippingFields: ShippingFields) {
    if (!this.shipping.shippingData.shippingUID) {
      this.createShipping(shippingFields);
    } else {
      this.updateShipping(this.shipping.shippingData.shippingUID, shippingFields);
    }
  }


  private setTexts() {
    const customers = this.customers.map(x => x.name).toString();
    const vendors = this.vendors.map(x => x.name).toString();
    const date = DateStringLibrary.format(this.shipping.shippingData.shippingDate, 'DMY HH:mm');

    this.titleText = 'Editor de envío por paquetería';
    this.hintText = `<strong>Cliente:</strong> ${customers} &nbsp; &nbsp; ` +
      `<strong>Vendedor:</strong> ${vendors}  &nbsp; &nbsp; <strong>Fecha:</strong> ${date}`;
  }

}
