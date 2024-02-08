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

import { Shipping, EmptyShipping, ShippingQuery, ShippingFields, ShippingDataFields,
         ShippingPalletWithPackages, EmptyShippingPalletWithPackages } from '@app/models';

import { ShippingDataViewEventType } from '../shipping-data/shipping-data-view.component';

import { ShippingOrdersResumeEventType } from '../shipping-data/shipping-orders-resume.component';

import { ShippingOrdersSubmitterEventType } from '../shipping-data/shipping-orders-submitter.component';

import { ShippingOrdersModalEventType } from '../shipping-data/shipping-orders-modal.component';

import { ShippingPalletsTableEventType } from '../shipping-data/shipping-pallets-table.component';

import { ShippingPalletModalEventType } from '../shipping-pallets-edition/shipping-pallet-modal.component';

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

  isShippingDataReady = false;

  shippingFields: ShippingFields = {orders: [], shippingData: null};

  displayShippingPalletModal = false;

  shippingPalletSelected: ShippingPalletWithPackages = EmptyShippingPalletWithPackages;


  constructor(private shippingData: ShippingDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.loadInitData();
  }


  get canEdit(): boolean {
    return true;
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
      case ShippingDataViewEventType.CHANGE_DATA:
        Assertion.assertValue(event.payload.isFormReady, 'event.payload.isFormReady');
        Assertion.assertValue(event.payload.shippingDataFields, 'event.payload.shippingDataFields');
        this.isShippingDataReady = event.payload.isFormReady as boolean;
        this.shippingFields.shippingData = event.payload.shippingDataFields as ShippingDataFields;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingOrdersSubmitterEvent(event: EventInfo) {
    switch (event.type as ShippingOrdersSubmitterEventType) {
      case ShippingOrdersSubmitterEventType.SAVE_SHIPPING_CLICKED:
        this.validateSaveShippingToExecute(this.shippingFields);
        return;

      case ShippingOrdersSubmitterEventType.SEND_SHIPPING_CLICKED:
        this.sendShipment(this.shipping.shippingData.shippingUID);
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


  onShippingPalletsTableEvent(event: EventInfo) {
    switch (event.type as ShippingPalletsTableEventType) {
      case ShippingPalletsTableEventType.CREATE_ITEM_CLICKED:
        this.displayShippingPalletModal = true;
        this.shippingPalletSelected = EmptyShippingPalletWithPackages;
        return;

      case ShippingPalletsTableEventType.ITEM_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.displayShippingPalletModal = true;
        this.shippingPalletSelected = event.payload.item as ShippingPalletWithPackages;
        return;

      case ShippingPalletsTableEventType.DELETE_ITEM_CLICKED:

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingPalletModalEvent(event: EventInfo) {
    switch (event.type as ShippingPalletModalEventType) {
      case ShippingPalletModalEventType.CLOSE_MODAL_CLICKED:
        this.displayShippingPalletModal = false;
        this.shippingPalletSelected = EmptyShippingPalletWithPackages;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private initShippingFields() {
    this.shippingFields.shippingData = {
      shippingUID: this.shipping.shippingData.shippingUID ?? '',
      parcelSupplierUID: this.shipping.shippingData.parcelSupplier.uid ?? '',
      shippingGuide: this.shipping.shippingData.shippingGuide ?? '',
      parcelAmount: this.shipping.shippingData.parcelAmount ?? null,
      customerAmount: this.shipping.shippingData.customerAmount ?? null,
    }

    this.shippingFields.orders = [...[], ...this.shipping.ordersForShipping.map(x => x.orderUID)];
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

  private sendShipment(shippingUID: string) {
    this.submitted = true;

    this.shippingData.sendShipment(shippingUID)
      .firstValue()
      .then(x => this.resolveSendShipment(x))
      .finally(() => this.submitted = false);
  }


  private setShipping(shipping: Shipping) {
    this.shipping = shipping;
    this.setTexts();
    this.initShippingFields();
  }


  private resolveShippingSaved(shipping: Shipping) {
    this.setShipping(shipping);
    this.messageBox.show('La infomación fue guardada correctamente.', 'Envío por paquetería');
  }


  private resolveSendShipment(shipping: Shipping) {
    this.setShipping(shipping);
    this.messageBox.show('La infomación fue guardada correctamente.', 'Enviar a embarque');
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
