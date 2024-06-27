/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AppStatusStateAction } from '@app/presentation/app-data/_app-data.presentation.types';

import { clone, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { AlertService } from '@app/shared/containers/alert/alert.service';

import { SalesDataService } from '@app/data-services';

import { DefaultOrdersStatus, EmptySaleOrder, SaleOrder, SaleOrderData, SaleOrderItem, ProductSelection,
         mapSaleOrderFieldsFromSaleOrder,  mapSaleOrderItemFromProductSelection } from '@app/models';

import { ProductsSelectorEventType } from '@app/views/products/products-selector/products-selector.component';

import { SaleOrderSubmitterEventType } from './sale-order-submitter.component';

import { SaleOrderItemsEventType } from './sale-order-items.component';

import { SaleOrderHeaderComponent, SaleOrderHeaderEventType } from './sale-order-header.component';

import { SaleOrderSummaryComponent, SaleOrderSummaryEventType } from './sale-order-summary.component';


export enum SaleOrderEditionEventType {
  CREATE_ORDER      = 'SaleOrderEditionComponent.Event.CreateOrder',
  UPDATE_ORDER      = 'SaleOrderEditionComponent.Event.UpdateOrder',
  APPLY_ORDER       = 'SaleOrderEditionComponent.Event.ApplyOrder',
  AUTHORIZE_ORDER   = 'SaleOrderEditionComponent.Event.AuthorizeOrder',
  DEAUTHORIZE_ORDER = 'SaleOrderEditionComponent.Event.DeauthorizeOrder',
  CANCEL_ORDER      = 'SaleOrderEditionComponent.Event.CancelOrder',
}

@Component({
  selector: 'emp-trade-sale-order-edition',
  templateUrl: './sale-order-edition.component.html',
})
export class SaleOrderEditionComponent implements OnChanges, OnDestroy {

  @ViewChild('saleOrderHeader') saleOrderHeader: SaleOrderHeaderComponent;

  @ViewChild('saleOrderSummary') saleOrderSummary: SaleOrderSummaryComponent;

  @Input() order: SaleOrder = EmptySaleOrder();

  @Output() saleOrderEditionEvent = new EventEmitter<EventInfo>();

  editionMode = true;

  isOrderDataValid = false;

  isOrderAdditionalDataValid = true;

  displayProductsSelector = false;

  isLoading = false;

  orderForEdition: SaleOrder = EmptySaleOrder();

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private salesData: SalesDataService,
              private messageBox: MessageBoxService,
              private alertService: AlertService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.initOrderForEdition();
    this.editionMode = !this.isSaved;
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  get isSaved(): boolean {
    return !!this.order.orderData.uid;
  }


  get canEdit(): boolean {
    return this.order.orderData.status === DefaultOrdersStatus;
  }


  get isOrderItemsValid(): boolean {
    return this.orderForEdition.items.length > 0;
  }


  get isReady(): boolean {
    return this.isOrderDataValid && this.isOrderAdditionalDataValid && this.isOrderItemsValid;
  }


  onSaleOrderHeaderEvent(event: EventInfo) {
    switch (event.type as SaleOrderHeaderEventType) {

      case SaleOrderHeaderEventType.CHANGE_DATA:
        Assertion.assertValue(event.payload.isFormValid, 'event.payload.isFormValid');
        Assertion.assertValue(event.payload.isFormDirty, 'event.payload.isFormDirty');
        Assertion.assertValue(event.payload.data, 'event.payload.data');

        this.isOrderDataValid = event.payload.isFormValid as boolean;
        this.validateSaleOrderHeaderChanges(event.payload.data as SaleOrderData);
        this.setDirtyOrder(event.payload.isFormDirty);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSaleOrderItemsEvent(event: EventInfo) {
    switch (event.type as SaleOrderItemsEventType) {

      case SaleOrderItemsEventType.ADD_ORDER_ITEM_CLICKED:
        this.displayProductsSelector = true;
        return;

      case SaleOrderItemsEventType.REMOVE_ORDER_ITEM_CLICKED:
        Assertion.assertValue(event.payload.orderItem, 'event.payload.orderItem');
        this.removeOrderItem(event.payload.orderItem as SaleOrderItem);
        return;

      case SaleOrderItemsEventType.UPDATE_ORDER_ITEM:
        Assertion.assertValue(event.payload.orderItem, 'event.payload.orderItem');
        this.updateOrderItem(event.payload.orderItem as SaleOrderItem);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSaleOrderSummaryEvent(event: EventInfo) {
    switch (event.type as SaleOrderSummaryEventType) {

      case SaleOrderSummaryEventType.CHANGE_DATA:
        Assertion.assertValue(event.payload.isFormValid, 'event.payload.isFormValid');
        Assertion.assertValue(event.payload.isFormDirty, 'event.payload.isFormDirty');
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.isOrderAdditionalDataValid = event.payload.isFormValid as boolean;
        const orderDataUpdated = { ...this.orderForEdition.orderData, ...event.payload.data as SaleOrderData };
        this.setOrderForEdition({ ...this.orderForEdition, ...{ orderData: orderDataUpdated } });
        this.setDirtyOrder(event.payload.isFormDirty);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSaleOrderSubmitterEvent(event: EventInfo) {
    switch (event.type as SaleOrderSubmitterEventType) {
      case SaleOrderSubmitterEventType.TOGGLE_EDITION_MODE_CLICKED:
        this.toggleEditionMode();
        return;
      case SaleOrderSubmitterEventType.CREATE_BUTTON_CLICKED:
        this.validateAndEmitEvent(SaleOrderEditionEventType.CREATE_ORDER, this.orderForEdition);
        return;
      case SaleOrderSubmitterEventType.UPDATE_BUTTON_CLICKED:
        this.validateAndEmitEvent(SaleOrderEditionEventType.UPDATE_ORDER, this.orderForEdition);
        return;
      case SaleOrderSubmitterEventType.APPLY_BUTTON_CLICKED:
        this.emitEvent(SaleOrderEditionEventType.APPLY_ORDER, this.orderForEdition.orderData.uid);
        return;
      case SaleOrderSubmitterEventType.AUTHORIZE_BUTTON_CLICKED:
        this.emitEvent(SaleOrderEditionEventType.AUTHORIZE_ORDER, this.orderForEdition.orderData.uid);
        return;
      case SaleOrderSubmitterEventType.DEAUTHORIZE_BUTTON_CLICKED:
        sendEvent(this.saleOrderEditionEvent, SaleOrderEditionEventType.DEAUTHORIZE_ORDER,
          { orderUID: this.orderForEdition.orderData.uid, notes: event.payload.notes });
        return;
      case SaleOrderSubmitterEventType.CANCEL_BUTTON_CLICKED:
        this.emitEvent(SaleOrderEditionEventType.CANCEL_ORDER, this.orderForEdition.orderData.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProductsSelectorEvent(event: EventInfo) {
    switch (event.type as ProductsSelectorEventType) {

      case ProductsSelectorEventType.CLOSE_MODAL_CLICKED:
        this.displayProductsSelector = false;
        return;

      case ProductsSelectorEventType.ADD_PRODUCT:
        Assertion.assert(event.payload.selection, 'event.payload.selection');
        Assertion.assert(event.payload.selection.product, 'event.payload.selection.product');
        Assertion.assert(event.payload.selection.presentation, 'event.payload.selection.presentation');
        Assertion.assert(event.payload.selection.vendor, 'event.payload.selection.vendor');
        Assertion.assert(event.payload.selection.quantity, 'event.payload.selection.quantity');

        const orderItem = mapSaleOrderItemFromProductSelection(event.payload.selection as ProductSelection);

        this.addOrderItem(orderItem);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private toggleEditionMode() {
    this.editionMode = !this.editionMode;
    this.setIsUserWorkingStatus(this.editionMode);
    this.initOrderForEdition();
  }


  private setIsUserWorkingStatus(isWorking: boolean) {
    this.uiLayer.dispatch(AppStatusStateAction.SET_IS_USER_WORKING, isWorking);
  }


  private emitEvent(event: SaleOrderEditionEventType, orderUID: string) {
    sendEvent(this.saleOrderEditionEvent, event, { orderUID });
  }


  private validateAndEmitEvent(event: SaleOrderEditionEventType, order: SaleOrder) {
    if (!this.isReady) {
      this.invalidateForms();
      return;
    }

    sendEvent(this.saleOrderEditionEvent, event, { order });
  }


  private initOrderForEdition() {
    this.setOrderForEdition(this.order);
  }


  private setOrderForEdition(order: SaleOrder) {
    this.orderForEdition = clone<SaleOrder>(order);
  }


  private isItemInOrder(item: SaleOrderItem): boolean {
    return this.orderForEdition.items.some(x => this.isSameOrderItem(x, item));
  }


  private isSameOrderItem(item1: SaleOrderItem, item2: SaleOrderItem): boolean {
    return item1.vendor.vendorProductUID === item2.vendor.vendorProductUID
  }


  private fieldHasChanges(newItem: Identifiable, oldItem: Identifiable): boolean {
    return !isEmpty(newItem) && newItem?.uid !== oldItem?.uid;
  }


  private validateSaleOrderHeaderChanges(data: SaleOrderData) {
    const recalculateItems = this.needRecalculateItems(data, this.orderForEdition.orderData);

    const orderDataUpdated = { ...this.orderForEdition.orderData, ...data };

    this.setOrderForEdition({ ...this.orderForEdition, ...{ orderData: orderDataUpdated } });

    if (recalculateItems) {
      this.validateCalculateOrder();
    }
  }


  private needRecalculateItems(newData: SaleOrderData, oldData: SaleOrderData) {
    const hasItems = this.orderForEdition.items.length > 0;

    const hasChanges = this.fieldHasChanges(newData.customer, oldData.customer) ||
                       this.fieldHasChanges(newData.customerAddress, oldData.customerAddress) ||
                       this.fieldHasChanges(newData.customerContact, oldData.customerContact) ||
                       this.fieldHasChanges(newData.supplier, oldData.supplier);

    return hasItems && hasChanges;
  }


  private validateCalculateOrder() {
    if (this.isOrderDataValid) {
      this.calculateOrder(this.orderForEdition);
    } else {
      setTimeout(() => this.invalidateForms());
    }
  }


  private addOrderItem(item: SaleOrderItem) {
    if (this.isItemInOrder(item)) {
      this.showMessageItemInOrder(item);
      return;
    }

    const orderToRecalculate = clone<SaleOrder>(this.orderForEdition);
    orderToRecalculate.items.push(item);

    this.calculateOrder(orderToRecalculate);
  }


  private updateOrderItem(item: SaleOrderItem) {
    const orderToRecalculate = clone<SaleOrder>(this.orderForEdition);
    const index = orderToRecalculate.items.findIndex(x => this.isSameOrderItem(x, item));

    if(index !== -1) orderToRecalculate.items[index] = item;

    this.calculateOrder(orderToRecalculate);
  }


  private removeOrderItem(item: SaleOrderItem) {
    const orderToRecalculate = clone<SaleOrder>(this.orderForEdition);
    orderToRecalculate.items = orderToRecalculate.items.filter(x => !this.isSameOrderItem(x, item));
    this.calculateOrder(orderToRecalculate);
  }


  private calculateOrder(order: SaleOrder) {
    this.isLoading = true;

    const orderFields = mapSaleOrderFieldsFromSaleOrder(order);

    this.salesData.calculateOrder(orderFields)
      .firstValue()
      .then(x => this.resolveCalculateOrderResponse(x))
      .catch(e => this.handleCalculateOrderError())
      .finally(() => this.isLoading = false);
  }


  private resolveCalculateOrderResponse(order: SaleOrder) {
    this.setOrderForEdition(order);
    if(this.displayProductsSelector) {
      this.alertService.openAlert('Se agregó el producto al pedido.');
    }
  }


  private handleCalculateOrderError() {
    this.setOrderForEdition(this.orderForEdition);
    this.messageBox.showError('Ocurrió un error al procesar el pedido.');
  }


  private invalidateForms() {
    this.saleOrderHeader.invalidateForm();
    this.saleOrderSummary.invalidateForm();
  }


  private showMessageItemInOrder(item: SaleOrderItem) {
    const title = 'Producto duplicado en el pedido';

    const message = `El producto ya se encuentra agregado, edite la cantidad en el detalle del pedido.<br>
      <table class="confirm-data">
        <tr><td>Clave: </td><td><strong>${item.product?.productCode}</strong></td></tr>
        <tr><td>Presentación: </td><td><strong>${item.presentation.description}</strong></td></tr>
        <tr><td>Proveedor: </td><td><strong>${item.vendor.vendorName}</strong></td></tr>
      </table>`;

    this.messageBox.show(message, title);
  }


  private setDirtyOrder(dirty: boolean) {
    const canMarkDirty = !this.isSaved || (this.isSaved && this.editionMode);

    if (canMarkDirty && dirty) {
      this.setIsUserWorkingStatus(dirty);
    }
  }

}
