/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo, MediaBase } from '@app/core';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { FilePreviewComponent } from '@app/shared/containers';

import { ShippingDataService } from '@app/data-services';

import { Shipping, EmptyShipping, ShippingFieldsQuery, ShippingFields, ShippingDataFields,
         ShippingPalletWithPackages, EmptyShippingPalletWithPackages, ShippingPalletFields,
         ShippingQueryType, DefaultShippingMethod } from '@app/models';

import { ShippingDataViewEventType } from '../shipping-edition/shipping-data-view.component';

import { PackagingResumeEventType } from './packaging-resume.component';

import { ShippingOrdersSubmitterEventType } from '../shipping-edition/shipping-orders-submitter.component';

import { ShippingOrdersTableEventType } from '../shipping-edition/shipping-orders-table.component';

import { ShippingPalletsTableEventType } from '../pallet-edition/shipping-pallets-table.component';

import { ShippingOrdersModalEventType } from '../shipping-edition/shipping-orders-modal.component';

import { ShippingPalletModalEventType } from '../pallet-edition/shipping-pallet-modal.component';


export enum ShippingEditionEventType {
  SHIPPING_UPDATED = 'ShippingEditionComponent.Event.ShippingUpdated',
  SHIPPING_DELETED = 'ShippingEditionComponent.Event.ShippingDeleted',
  STATUS_UPDATED   = 'ShippingEditionComponent.Event.StatusUpdated',
  DATA_ERROR       = 'ShippingEditionComponent.Event.DataError',
  DATA_DESCRIPTION = 'ShippingEditionComponent.Event.DataDescription',
}

@Component({
  selector: 'emp-trade-shipping-edition',
  templateUrl: './shipping-edition.component.html',
})
export class ShippingEditionComponent implements OnChanges, OnInit {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  @Input() queryType: ShippingQueryType = ShippingQueryType.Shipping;

  @Input() shippingUID: string = null;

  @Input() orders: string[] = null;

  @Output() shippingEditionEvent = new EventEmitter<EventInfo>();

  isLoading = false;

  submitted = false;

  initialLoadExecuted = false;

  putOnPallets: boolean = false;

  shipping: Shipping = EmptyShipping;

  displayShippingOrdersModal = false;

  editionMode = false;

  isShippingDataReady = false;

  isShippingDataDirty = false;

  shippingFields: ShippingFields = { orders: [], shippingData: null };

  displayShippingPalletModal = false;

  shippingPalletSelected: ShippingPalletWithPackages = EmptyShippingPalletWithPackages;


  constructor(private shippingData: ShippingDataService,
              private messageBox: MessageBoxService) { }


  ngOnInit() {
    if(this.isShippingCreator) {
      this.setShipping(EmptyShipping);
    }
  }


  ngOnChanges() {
    this.resetFlags();
    this.loadInitData();
  }


  get isQueryByShippingUID(): boolean {
    return !!this.shippingUID;
  }


  get isQueryByOrders(): boolean {
    return !!this.orders && this.orders.length > 0;
  }


  get isShippingCreator(): boolean {
    return !this.isQueryByOrders && !this.isQueryByShippingUID;
  }


  get isSaved(): boolean {
    return !!this.shipping.shippingData.shippingUID;
  }


  get canEdit(): boolean {
    return !this.isSaved || (this.isSaved && this.shipping.actions.canEdit);
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
        Assertion.assertValue(event.payload.isFormDirty, 'event.payload.isFormDirty');
        Assertion.assertValue(event.payload.shippingDataFields, 'event.payload.shippingDataFields');
        this.isShippingDataReady = event.payload.isFormReady as boolean;
        this.isShippingDataDirty = event.payload.isFormDirty as boolean;
        this.shippingFields.shippingData = event.payload.shippingDataFields as ShippingDataFields;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingOrdersSubmitterEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ShippingOrdersSubmitterEventType) {
      case ShippingOrdersSubmitterEventType.TOGGLE_EDITION_MODE_CLICKED:
        this.toggleEditionMode();
        return;

      case ShippingOrdersSubmitterEventType.SAVE_SHIPPING_CLICKED:
        this.validateSaveShippingToExecute(this.shippingFields);
        return;

      case ShippingOrdersSubmitterEventType.DELETE_SHIPPING_CLICKED:
        this.deleteShipping(this.shipping.shippingData.shippingUID);
        return;

      case ShippingOrdersSubmitterEventType.CLOSE_EDITION_CLICKED:
        this.closeShippingEdition(this.shipping.shippingData.shippingUID);
        return;

      case ShippingOrdersSubmitterEventType.CLOSE_SHIPPING_CLICKED:
        this.closeShipping(this.shipping.shippingData.shippingUID);
        return;

      case ShippingOrdersSubmitterEventType.PRINT_SHIPPING_LABELS_CLICKED:
        this.openFilePreview(this.shipping.shippingData.shippingLabelsMedia, 'Label');
        return;

      case ShippingOrdersSubmitterEventType.PRINT_ORDERS_CLICKED:
        this.openFilePreview(this.shipping.shippingData.billingsMedia, 'Order');
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingOrdersTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

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

      case ShippingOrdersTableEventType.PRINT_ORDER:
        Assertion.assertValue(event.payload.media, 'event.payload.media');
        this.openFilePreview(event.payload.media, 'Order');
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingOrdersModalEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

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

      case ShippingOrdersModalEventType.PRINT_ORDER:
        Assertion.assertValue(event.payload.media, 'event.payload.media');
        this.openFilePreview(event.payload.media, 'Order');
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingPalletsTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ShippingPalletsTableEventType) {
      case ShippingPalletsTableEventType.CREATE_PALLET_CLICKED:
        this.setShippingPalletSelected(EmptyShippingPalletWithPackages, true);
        return;

      case ShippingPalletsTableEventType.UPDATE_PALLET_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.setShippingPalletSelected(event.payload.item as ShippingPalletWithPackages);
        return;

      case ShippingPalletsTableEventType.DELETE_PALLET:
        Assertion.assertValue(event.payload.shippingPalletUID, 'event.payload.shippingPalletUID');
        this.deleteShippingPallet(this.shipping.shippingData.shippingUID, event.payload.shippingPalletUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingPalletModalEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ShippingPalletModalEventType) {
      case ShippingPalletModalEventType.CLOSE_MODAL_CLICKED:
        this.setShippingPalletSelected(EmptyShippingPalletWithPackages);
        return;

      case ShippingPalletModalEventType.CREATE_PALLET:
        Assertion.assertValue(event.payload.shippingPalletFields, 'event.payload.shippingPalletFields');

        this.createShippingPallet(this.shipping.shippingData.shippingUID,
                                  event.payload.shippingPalletFields as ShippingPalletFields);
        return;

      case ShippingPalletModalEventType.UPDATE_PALLET:
        Assertion.assertValue(event.payload.shippingPalletFields, 'event.payload.shippingPalletFields');
        Assertion.assertValue(event.payload.shippingPalletUID, 'event.payload.shippingPalletUID');

        this.updateShippingPallet(this.shipping.shippingData.shippingUID,
                                  event.payload.shippingPalletUID as string,
                                  event.payload.shippingPalletFields as ShippingPalletFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private initShippingFields() {
    if (!this.isShippingDataDirty) {
      this.shippingFields.shippingData = {
        shippingUID: this.shipping.shippingData.shippingUID ?? '',
        parcelSupplierUID: this.shipping.shippingData.parcelSupplier.uid ?? '',
        shippingGuide: this.shipping.shippingData.shippingGuide ?? '',
        parcelAmount: this.shipping.shippingData.parcelAmount ?? null,
        customerAmount: this.shipping.shippingData.customerAmount ?? null,
      };
    }

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


  private resetFlags() {
    this.initialLoadExecuted = false;
    this.isShippingDataDirty = false;
    this.putOnPallets = false;
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

    this.shippingData.getShipping(this.queryType, this.shippingUID)
      .firstValue()
      .then(x => this.setShipping(x))
      .catch(x => this.resolveShippingError())
      .finally(() => this.isLoading = false);
  }


  private getShippingByOrders(query: ShippingFieldsQuery) {
    this.isLoading = true;

    this.shippingData.getShippingByOrders(query)
      .firstValue()
      .then(x => this.resolveGetShippingByOrders(x))
      .catch(x => this.resolveGetShippingByOrdersError())
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


  private deleteShipping(shippingUID: string) {
    this.submitted = true;

    this.shippingData.deleteShipping(shippingUID)
      .firstValue()
      .then(() => this.resolveShippingDeleted())
      .finally(() => this.submitted = false);
  }


  private AddOrderToShipping(shippingUID: string, orderUID: string) {
    this.submitted = true;

    this.shippingData.AddOrderToShipping(shippingUID, orderUID)
      .firstValue()
      .then(x => this.resolveShippingOrderSaved(x))
      .finally(() => this.submitted = false);
  }


  private removeOrderToShipping(shippingUID: string, orderUID: string) {
    this.submitted = true;

    this.shippingData.removeOrderFromShipping(shippingUID, orderUID)
      .firstValue()
      .then(x => this.resolveShippingOrderSaved(x))
      .finally(() => this.submitted = false);
  }


  private createShippingPallet(shippingUID: string,
                               dataFields: ShippingPalletFields) {
    this.submitted = true;

    this.shippingData.createShippingPallet(shippingUID, dataFields)
      .firstValue()
      .then(x => this.resolveShippingPalletSaved(x))
      .finally(() => this.submitted = false);
  }


  private updateShippingPallet(shippingUID: string,
                               shippingPalletUID: string,
                               dataFields: ShippingPalletFields) {
    this.submitted = true;
    this.shippingData.updateShippingPallet(shippingUID, shippingPalletUID, dataFields)
      .firstValue()
      .then(x => this.resolveShippingPalletSaved(x))
      .finally(() => this.submitted = false);
  }


  private deleteShippingPallet(shippingUID: string, shippingPalletUID: string) {
    this.submitted = true;

    this.shippingData.deleteShippingPallet(shippingUID, shippingPalletUID)
      .firstValue()
      .then(x => this.resolveShippingSaved(x))
      .finally(() => this.submitted = false);
  }


  private closeShippingEdition(shippingUID: string) {
    this.submitted = true;

    this.shippingData.closeShippingEdition(shippingUID)
      .firstValue()
      .then(x => this.resolveCloseShippingEdition(x))
      .finally(() => this.submitted = false);
  }


  private closeShipping(shippingUID: string) {
    this.submitted = true;

    this.shippingData.closeShipping(shippingUID)
      .firstValue()
      .then(x => this.resolveCloseShipping(x))
      .finally(() => this.submitted = false);
  }


  private setShipping(shipping: Shipping) {
    // TODO: remove this
    shipping.shippingData.shippingMethod = DefaultShippingMethod;
    shipping.shippingData.shippingID =
      shipping.shippingData.parcelSupplier.name + ' - ' + shipping.shippingData.shippingGuide;
    // END TODO

    this.shipping = shipping;
    this.initialLoadExecuted = true;

    this.validateSetPutOnPallets();
    this.validateSetEditionMode();
    this.initShippingFields();
    this.emitDataDescription();
  }


  private validateSetEditionMode() {
    if (this.isShippingCreator || !this.isSaved) {
      this.editionMode = true;
    } else {
      this.editionMode = this.editionMode && this.isShippingDataDirty ? true : false;
    }
  }


  private toggleEditionMode() {
    this.editionMode = !this.editionMode;
  }


  private validateSetPutOnPallets() {
    if (this.displayShippingOrdersModal) {
      this.putOnPallets = true;
    } else {
      this.putOnPallets = this.shipping.shippingPalletsWithPackages?.length > 0;
    }
  }


  private resolveGetShippingByOrders(shipping: Shipping) {
    if (this.isShippingCreator && !!shipping.shippingData.shippingUID) {
      this.messageBox.showError('El pedido ya se encuentra en otro envío.');
    } else {
      this.setShipping(shipping);
    }
  }


  private resolveShippingSaved(shipping: Shipping) {
    this.isShippingDataDirty = false;
    this.setShipping(shipping);
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.SHIPPING_UPDATED,
      { shippingData: shipping.shippingData });
  }


  private resolveShippingOrderSaved(shipping: Shipping) {
    this.setShipping(shipping);
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.SHIPPING_UPDATED,
      { shippingData: shipping.shippingData });
  }


  private resolveShippingPalletSaved(shipping: Shipping) {
    this.setShipping(shipping);
    this.setShippingPalletSelected(EmptyShippingPalletWithPackages);
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.SHIPPING_UPDATED,
      { shippingData: shipping.shippingData });
  }


  private resolveShippingDeleted() {
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.SHIPPING_DELETED);
    this.messageBox.show('El envío fue cancelado correctamente.', 'Cancelar envío');
  }


  private resolveCloseShippingEdition(shipping: Shipping) {
    this.setShipping(shipping);
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.STATUS_UPDATED,
      { shippingData: shipping.shippingData });
    this.messageBox.show('La infomación fue guardada correctamente.', 'Enviar a embarque');
  }


  private resolveCloseShipping(shipping: Shipping) {
    this.setShipping(shipping);
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.STATUS_UPDATED,
      { shippingData: shipping.shippingData });
    this.messageBox.show('La infomación fue guardada correctamente.', 'Cerrar embarque');
  }


  private resolveShippingError() {
    sendEvent(this.shippingEditionEvent, ShippingEditionEventType.DATA_ERROR);
  }


  private resolveGetShippingByOrdersError() {
    if (!this.initialLoadExecuted) {
      this.resolveShippingError();
    }
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

    return !dataDescription ? 'Información del envío.' : dataDescription;
  }


  private openFilePreview(media: MediaBase, type: 'Label' | 'Order') {
    if (type === 'Label') {
      this.filePreview.open(media.url, media.mediaType); // TODO: fix label sizes: 700, 750
      return;
    }

    this.filePreview.open(media.url, media.mediaType);
  }

}
