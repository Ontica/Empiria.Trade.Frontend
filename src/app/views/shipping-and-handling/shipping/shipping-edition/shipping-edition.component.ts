/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ShippingDataService } from '@app/data-services';

import { Shipping, EmptyShipping, ShippingFieldsQuery, ShippingFields, ShippingDataFields,
         ShippingPalletWithPackages, EmptyShippingPalletWithPackages } from '@app/models';

import { ShippingDataViewEventType } from '../shipping-edition/shipping-data-view.component';

import { PackagingResumeEventType } from './packaging-resume.component';

import { ShippingOrdersSubmitterEventType } from '../shipping-edition/shipping-orders-submitter.component';

import { ShippingOrdersTableEventType } from '../shipping-edition/shipping-orders-table.component';

import { ShippingPalletsTableEventType } from '../shipping-edition/shipping-pallets-table.component';

import { ShippingOrdersModalEventType } from '../shipping-edition/shipping-orders-modal.component';

import { ShippingPalletModalEventType } from '../pallet-edition/shipping-pallet-modal.component';


export enum ShippingEditionEventType {
  SHIPPING_UPDATED = 'ShippingEditionComponent.Event.ShippingUpdated',
  SHIPPING_SENT    = 'ShippingEditionComponent.Event.ShippingSent',
  DATA_ERROR       = 'ShippingEditionComponent.Event.DataError',
  DATA_DESCRIPTION = 'ShippingEditionComponent.Event.DataDescription',
}

@Component({
  selector: 'emp-trade-shipping-edition',
  templateUrl: './shipping-edition.component.html',
})
export class ShippingEditionComponent implements OnChanges {

  @Input() shippingUID: string = null;

  @Input() orders: string[] = null;

  @Output() shippingEditionEvent = new EventEmitter<EventInfo>();

  isLoading = false;

  submitted = false;

  putOnPallets: boolean = false;

  shipping: Shipping = EmptyShipping;

  displayShippingOrdersModal = false;

  editionMode = true;

  isShippingDataReady = false;

  shippingFields: ShippingFields = { orders: [], shippingData: null };

  displayShippingPalletModal = false;

  shippingPalletSelected: ShippingPalletWithPackages = EmptyShippingPalletWithPackages;


  constructor(private shippingData: ShippingDataService,
    private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.loadInitData();
  }


  get isQueryByShippingUID(): boolean {
    return !!this.shippingUID;
  }


  get isQueryByOrders(): boolean {
    return !!this.orders && this.orders.length > 0;
  }


  get isSaved(): boolean {
    return !!this.shipping.shippingData.shippingUID;
  }


  get canEdit(): boolean {
    return !this.isSaved || (this.isSaved && this.shipping.canEdit);
  }


  onPackagingResumeEvent(event: EventInfo) {
    switch (event.type as PackagingResumeEventType) {
      case PackagingResumeEventType.SHOW_DETAIL_CLICKED:
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
      case ShippingOrdersSubmitterEventType.TOGGLE_EDITION_MODE_CLICKED:
        this.toggleEditionMode();
        return;

      case ShippingOrdersSubmitterEventType.SAVE_SHIPPING_CLICKED:
        this.validateSaveShippingToExecute(this.shippingFields);
        return;

      case ShippingOrdersSubmitterEventType.SEND_SHIPPING_CLICKED:
        this.sendShipment(this.shipping.shippingData.shippingUID);
        return;

      case ShippingOrdersSubmitterEventType.CANCEL_SHIPPING_CLICKED:
        this.messageBox.showInDevelopment('Cancelar envío');
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingOrdersTableEvent(event: EventInfo) {
    switch (event.type as ShippingOrdersTableEventType) {
      case ShippingOrdersTableEventType.CHANGE_ORDERS:
        Assertion.assertValue(event.payload.orders, 'event.payload.orders');
        this.validateRefreshShipping(event.payload.orders);
        return;

      case ShippingOrdersTableEventType.ADD_ORDER:
        Assertion.assertValue(event.payload.shippingUID, 'event.payload.shippingUID');
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.AddOrderToShipping(event.payload.shippingUID, event.payload.orderUID);
        return;

      case ShippingOrdersTableEventType.REMOVE_ORDER:
        Assertion.assertValue(event.payload.shippingUID, 'event.payload.shippingUID');
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.removeOrderToShipping(event.payload.shippingUID, event.payload.orderUID);
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

      case ShippingOrdersModalEventType.CHANGE_ORDERS:
        Assertion.assertValue(event.payload.orders, 'event.payload.orders');
        this.validateRefreshShipping(event.payload.orders);
        return;

      case ShippingOrdersModalEventType.ADD_ORDER:
        Assertion.assertValue(event.payload.shippingUID, 'event.payload.shippingUID');
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.AddOrderToShipping(event.payload.shippingUID, event.payload.orderUID);
        return;

      case ShippingOrdersModalEventType.REMOVE_ORDER:
        Assertion.assertValue(event.payload.shippingUID, 'event.payload.shippingUID');
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.removeOrderToShipping(event.payload.shippingUID, event.payload.orderUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingPalletsTableEvent(event: EventInfo) {
    switch (event.type as ShippingPalletsTableEventType) {
      case ShippingPalletsTableEventType.CREATE_ITEM_CLICKED:
        this.setShippingPalletSelected(EmptyShippingPalletWithPackages, true);
        return;

      case ShippingPalletsTableEventType.ITEM_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.setShippingPalletSelected(event.payload.item as ShippingPalletWithPackages);
        return;

      case ShippingPalletsTableEventType.DELETE_ITEM_CLICKED:
        this.messageBox.showInDevelopment('Eliminar tarima');
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingPalletModalEvent(event: EventInfo) {
    switch (event.type as ShippingPalletModalEventType) {
      case ShippingPalletModalEventType.CLOSE_MODAL_CLICKED:
        this.setShippingPalletSelected(EmptyShippingPalletWithPackages);
        return;

      case ShippingPalletModalEventType.PALLET_SAVED:
        Assertion.assertValue(event.payload.shipping, 'event.payload.shipping');
        this.setShipping(event.payload.shipping as Shipping);
        this.setShippingPalletSelected(EmptyShippingPalletWithPackages);
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
    };

    this.shippingFields.orders = [...[], ...this.shipping.ordersForShipping.map(x => x.orderUID)];
  }


  private validateRefreshShipping(orders: string[]) {
    if (!orders || orders.length === 0) {
      this.messageBox.showError('Es necesaria al menos un pedido en el envío.');
      return;
    }

    if (!this.shipping.shippingData.shippingUID && !this.shippingUID) {
      const query: ShippingFieldsQuery = { orders };
      this.getShippingByOrders(query);
    }
  }


  private loadInitData() {
    if (this.isQueryByShippingUID) {
      this.getShipping();
      return;
    }

    if (this.isQueryByOrders) {
      const query: ShippingFieldsQuery = { orders: this.orders };
      this.getShippingByOrders(query);
      return;
    }
  }


  private getShipping() {
    this.isLoading = true;

    this.shippingData.getShipping(this.shippingUID)
      .firstValue()
      .then(x => this.setShipping(x))
      .catch(x => this.resolveShippingError())
      .finally(() => this.isLoading = false);
  }


  private getShippingByOrders(query: ShippingFieldsQuery) {
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


  private AddOrderToShipping(shippingUID: string, orderUID: string) {
    this.submitted = true;

    this.shippingData.AddOrderToShipping(shippingUID, orderUID)
      .firstValue()
      .then(x => this.resolveShippingOrdersUpdated(x))
      .finally(() => this.submitted = false);
  }


  private removeOrderToShipping(shippingUID: string, orderUID: string) {
    this.submitted = true;

    this.shippingData.removeOrderFromShipping(shippingUID, orderUID)
      .firstValue()
      .then(x => this.resolveShippingOrdersUpdated(x))
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
    this.editionMode = !this.isSaved;
    this.putOnPallets = this.displayShippingOrdersModal ? true :
      this.shipping.shippingPalletsWithPackages?.length > 0;

    this.initShippingFields();
    this.emitDataDescription();
  }


  private toggleEditionMode() {
    this.editionMode = !this.editionMode;
  }


  private resolveShippingSaved(shipping: Shipping) {
    this.setShipping(shipping);
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.SHIPPING_UPDATED,
      { shippingData: shipping.shippingData });
  }


  private resolveShippingOrdersUpdated(shipping: Shipping) {
    this.setShipping(shipping);
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.SHIPPING_UPDATED,
      { shippingData: shipping.shippingData });
  }


  private resolveSendShipment(shipping: Shipping) {
    this.setShipping(shipping);
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.SHIPPING_SENT,
      { shippingData: shipping.shippingData });
    this.messageBox.show('La infomación fue guardada correctamente.', 'Enviar a embarque');
  }


  private resolveShippingError() {
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.DATA_ERROR);
  }


  private validateSaveShippingToExecute(shippingFields: ShippingFields) {
    if (!this.shipping.shippingData.shippingUID) {
      this.createShipping(shippingFields);
    } else {
      this.updateShipping(this.shipping.shippingData.shippingUID, shippingFields);
    }
  }


  private setShippingPalletSelected(pallet: ShippingPalletWithPackages, display?: boolean) {
    this.shippingPalletSelected = pallet;
    this.displayShippingPalletModal = display ?? !!this.shippingPalletSelected.shippingPalletUID;
  }


  private emitDataDescription() {
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.DATA_DESCRIPTION,
      { description: this.getDataDescription()})
  }


  private getDataDescription(): string {
    let dataDescription: string = ''

    if (this.shipping.ordersForShipping.length > 0) {
      const customersList =
        ArrayLibrary.getUniqueItems(this.shipping.ordersForShipping.map(x => x.customer), 'uid');
      const vendorsList =
        ArrayLibrary.getUniqueItems(this.shipping.ordersForShipping.map(x => x.vendor), 'uid');

      dataDescription += `<strong>Cliente:</strong> ${customersList.map(x => x.name).toString()} &nbsp; &nbsp;` +
        `<strong>Vendedor:</strong> ${vendorsList.map(x => x.name).toString()}`;
    }

    if (this.shipping.shippingData.shippingUID) {
      const date = DateStringLibrary.format(this.shipping.shippingData.shippingDate, 'DMY HH:mm');

      dataDescription += `&nbsp; &nbsp;<strong>Fecha:</strong> ${date}`;
    }

    return dataDescription
  }

}
