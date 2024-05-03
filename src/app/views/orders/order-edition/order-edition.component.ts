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

import { SalesOrdersDataService } from '@app/data-services';

import { DefaultOrderStatus, EmptyOrder, Order, OrderData, OrderItem,
         ProductSelection, mapOrderFieldsFromOrder, mapOrderItemFromProductSelection } from '@app/models';

import { ProductsSelectorEventType } from '@app/views/products/products-selector/products-selector.component';

import { OrderSubmitterEventType } from './order-submitter.component';

import { OrderItemsEventType } from './order-items.component';

import { OrderHeaderComponent, OrderHeaderEventType } from './order-header.component';

import { OrderSummaryComponent, OrderSummaryEventType } from './order-summary.component';


export enum OrderEditionEventType {
  CREATE_ORDER      = 'OrderEditionComponent.Event.CreateOrder',
  UPDATE_ORDER      = 'OrderEditionComponent.Event.UpdateOrder',
  APPLY_ORDER       = 'OrderEditionComponent.Event.ApplyOrder',
  AUTHORIZE_ORDER   = 'OrderEditionComponent.Event.AuthorizeOrder',
  DEAUTHORIZE_ORDER = 'OrderEditionComponent.Event.DeauthorizeOrder',
  CANCEL_ORDER      = 'OrderEditionComponent.Event.CancelOrder',
}

@Component({
  selector: 'emp-trade-order-edition',
  templateUrl: './order-edition.component.html',
})
export class OrderEditionComponent implements OnChanges, OnDestroy {

  @ViewChild('orderHeader') orderHeader: OrderHeaderComponent;

  @ViewChild('orderSummary') orderSummary: OrderSummaryComponent;

  @Input() order: Order = EmptyOrder();

  @Output() orderEditionEvent = new EventEmitter<EventInfo>();

  editionMode = true;

  isOrderDataValid = false;

  isOrderAdditionalDataValid = true;

  displayProductsSelector = false;

  isLoading = false;

  orderForEdition: Order = EmptyOrder();

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private salesOrdersData: SalesOrdersDataService,
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
    return this.order.orderData.status === DefaultOrderStatus;
  }


  get isOrderItemsValid(): boolean {
    return this.orderForEdition.items.length > 0;
  }


  get isReady(): boolean {
    return this.isOrderDataValid && this.isOrderAdditionalDataValid && this.isOrderItemsValid;
  }


  onOrderHeaderEvent(event: EventInfo) {
    switch (event.type as OrderHeaderEventType) {

      case OrderHeaderEventType.CHANGE_DATA:
        Assertion.assertValue(event.payload.isFormValid, 'event.payload.isFormValid');
        Assertion.assertValue(event.payload.isFormDirty, 'event.payload.isFormDirty');
        Assertion.assertValue(event.payload.data, 'event.payload.data');

        this.isOrderDataValid = event.payload.isFormValid as boolean;
        this.validateOrderHeaderChanges(event.payload.data as OrderData);
        this.setDirtyOrder(event.payload.isFormDirty);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrderItemsEvent(event: EventInfo) {

    switch (event.type as OrderItemsEventType) {

      case OrderItemsEventType.ADD_ORDER_ITEM_CLICKED:
        this.displayProductsSelector = true;
        return;

      case OrderItemsEventType.REMOVE_ORDER_ITEM_CLICKED:
        Assertion.assertValue(event.payload.orderItem, 'event.payload.orderItem');
        this.removeOrderItem(event.payload.orderItem as OrderItem);
        return;

       case OrderItemsEventType.UPDATE_ORDER_ITEM:
        Assertion.assertValue(event.payload.orderItem, 'event.payload.orderItem');
        this.updateOrderItem(event.payload.orderItem as OrderItem);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrderSummaryEvent(event: EventInfo) {
    switch (event.type as OrderSummaryEventType) {

      case OrderSummaryEventType.CHANGE_DATA:
        Assertion.assertValue(event.payload.isFormValid, 'event.payload.isFormValid');
        Assertion.assertValue(event.payload.isFormDirty, 'event.payload.isFormDirty');
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.isOrderAdditionalDataValid = event.payload.isFormValid as boolean;
        const orderDataUpdated = { ...this.orderForEdition.orderData, ...event.payload.data as OrderData };
        this.setOrderForEdition({ ...this.orderForEdition, ...{ orderData: orderDataUpdated } });
        this.setDirtyOrder(event.payload.isFormDirty);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrderSubmitterEvent(event: EventInfo) {
    switch (event.type as OrderSubmitterEventType) {
      case OrderSubmitterEventType.TOGGLE_EDITION_MODE_CLICKED:
        this.toggleEditionMode();
        return;
      case OrderSubmitterEventType.CREATE_BUTTON_CLICKED:
        this.validateAndEmitEvent(OrderEditionEventType.CREATE_ORDER, this.orderForEdition);
        return;
      case OrderSubmitterEventType.UPDATE_BUTTON_CLICKED:
        this.validateAndEmitEvent(OrderEditionEventType.UPDATE_ORDER, this.orderForEdition);
        return;
      case OrderSubmitterEventType.APPLY_BUTTON_CLICKED:
        this.emitEvent(OrderEditionEventType.APPLY_ORDER, this.orderForEdition.orderData.uid);
        return;
      case OrderSubmitterEventType.AUTHORIZE_BUTTON_CLICKED:
        this.emitEvent(OrderEditionEventType.AUTHORIZE_ORDER, this.orderForEdition.orderData.uid);
        return;
      case OrderSubmitterEventType.DEAUTHORIZE_BUTTON_CLICKED:
        sendEvent(this.orderEditionEvent, OrderEditionEventType.DEAUTHORIZE_ORDER,
          { orderUID: this.orderForEdition.orderData.uid, notes: event.payload.notes });
        return;
      case OrderSubmitterEventType.CANCEL_BUTTON_CLICKED:
        this.emitEvent(OrderEditionEventType.CANCEL_ORDER, this.orderForEdition.orderData.uid);
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

        const orderItem = mapOrderItemFromProductSelection(event.payload.selection as ProductSelection);

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


  private emitEvent(event: OrderEditionEventType, orderUID: string) {
    sendEvent(this.orderEditionEvent, event, { orderUID });
  }


  private validateAndEmitEvent(event: OrderEditionEventType, order: Order) {
    if (!this.isReady) {
      this.invalidateForms();
      return;
    }

    sendEvent(this.orderEditionEvent, event, { order });
  }


  private initOrderForEdition() {
    this.setOrderForEdition(this.order);
  }


  private setOrderForEdition(order: Order) {
    this.orderForEdition = clone<Order>(order);
  }


  private isItemInOrder(item: OrderItem): boolean {
    return this.orderForEdition.items.some(x => this.isSameOrderItem(x, item));
  }


  private isSameOrderItem(item1: OrderItem, item2: OrderItem): boolean {
    return item1.vendor.vendorProductUID === item2.vendor.vendorProductUID
  }


  private fieldHasChanges(newItem: Identifiable, oldItem: Identifiable): boolean {
    return !isEmpty(newItem) && !isEmpty(oldItem) && newItem.uid !== oldItem.uid;
  }


  private validateOrderHeaderChanges(data: OrderData) {
    const recalculateItems = this.orderForEdition.items.length > 0 &&
      (this.fieldHasChanges(data.customer, this.orderForEdition.orderData.customer) ||
       this.fieldHasChanges(data.supplier, this.orderForEdition.orderData.supplier));

    const orderDataUpdated = { ...this.orderForEdition.orderData, ...data };

    this.setOrderForEdition({ ...this.orderForEdition, ...{ orderData: orderDataUpdated } });

    if (recalculateItems) {
      this.calculateOrder(this.orderForEdition);
    }
  }


  private addOrderItem(item: OrderItem) {
    if (this.isItemInOrder(item)) {
      this.showMessageItemInOrder(item);
      return;
    }

    const orderToRecalculate = clone<Order>(this.orderForEdition);
    orderToRecalculate.items.push(item);

    this.calculateOrder(orderToRecalculate);
  }


  private updateOrderItem(item: OrderItem) {
    const orderToRecalculate = clone<Order>(this.orderForEdition);
    const index = orderToRecalculate.items.findIndex(x => this.isSameOrderItem(x, item));

    if(index !== -1) orderToRecalculate.items[index] = item;

    this.calculateOrder(orderToRecalculate);
  }


  private removeOrderItem(item: OrderItem) {
    const orderToRecalculate = clone<Order>(this.orderForEdition);
    orderToRecalculate.items = orderToRecalculate.items.filter(x => !this.isSameOrderItem(x, item));
    this.calculateOrder(orderToRecalculate);
  }


  private calculateOrder(order: Order) {
    this.isLoading = true;

    const orderFields = mapOrderFieldsFromOrder(order);

    this.salesOrdersData.calculateOrder(orderFields)
      .firstValue()
      .then(x => this.resolveCalculateOrderResponse(x))
      .catch(e => this.handleCalculateOrderError())
      .finally(() => this.isLoading = false);
  }


  private resolveCalculateOrderResponse(order: Order) {
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
    this.orderHeader.invalidateForm();
    this.orderSummary.invalidateForm();
  }


  private showMessageItemInOrder(item: OrderItem) {
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
    if (dirty) {
      this.setIsUserWorkingStatus(dirty);
    }
  }

}
