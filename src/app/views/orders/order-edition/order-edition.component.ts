/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { clone, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { AlertService } from '@app/shared/containers/alert/alert.service';

import { SalesOrdersDataService } from '@app/data-services';

import { DefaultOrderStatus, EmptyOrder, Order, OrderAdditionalData, OrderData, OrderItem, ProductSelection,
         mapOrderFieldsFromOrder, mapOrderItemFromProductSelection } from '@app/models';

import {
  ProductsSelectorEventType
} from '@app/views/inventory/products-selector/products-selector.component';

import { OrderSubmitterEventType } from './order-submitter.component';

import { OrderItemsEventType } from './order-items.component';

import { OrderHeaderComponent, OrderHeaderEventType } from './order-header.component';

import { OrderSummaryComponent, OrderSummaryEventType } from './order-summary.component';


export enum OrderEditionEventType {
  EDITION_MODE    = 'OrderEditionComponent.Event.EditionMode',
  ORDER_DIRTY     = 'OrderEditionComponent.Event.OrderDirty',
  CREATE_ORDER    = 'OrderEditionComponent.Event.CreateOrder',
  UPDATE_ORDER    = 'OrderEditionComponent.Event.UpdateOrder',
  APPLY_ORDER     = 'OrderEditionComponent.Event.ApplyOrder',
  AUTHORIZE_ORDER = 'OrderEditionComponent.Event.AuthorizeOrder',
  CANCEL_ORDER    = 'OrderEditionComponent.Event.CancelOrder',
}

@Component({
  selector: 'emp-trade-order-edition',
  templateUrl: './order-edition.component.html',
})
export class OrderEditionComponent implements OnChanges {

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


  constructor(private salesOrdersData: SalesOrdersDataService,
              private messageBox: MessageBoxService,
              private alertService: AlertService) { }


  ngOnChanges() {
    this.initOrderForEdition();
    this.editionMode = !this.isSaved;
  }


  get isSaved(): boolean {
    return !!this.order.uid;
  }


  get canEdit(): boolean {
    return this.order.status === DefaultOrderStatus;
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
        Assertion.assertValue(event.payload.orderData, 'event.payload.orderData');

        this.isOrderDataValid = event.payload.isFormValid as boolean;
        this.validateOrderHeaderChanges(event.payload.orderData as OrderData);
        this.emitOrderDirty(event.payload.isFormDirty);
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
        Assertion.assertValue(event.payload.orderAdditionalData, 'event.payload.orderAdditionalData');

        this.isOrderAdditionalDataValid = event.payload.isFormValid as boolean;
        this.setOrderForEdition({ ...this.orderForEdition,
          ...event.payload.orderAdditionalData as OrderAdditionalData });
        this.emitOrderDirty(event.payload.isFormDirty);
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
        this.emitEvent(OrderEditionEventType.APPLY_ORDER, this.orderForEdition.uid);
        return;
      case OrderSubmitterEventType.AUTHORIZE_BUTTON_CLICKED:
        this.emitEvent(OrderEditionEventType.AUTHORIZE_ORDER, this.orderForEdition.uid);
        return;

      case OrderSubmitterEventType.CANCEL_BUTTON_CLICKED:
        this.emitEvent(OrderEditionEventType.CANCEL_ORDER, this.orderForEdition.uid);
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

    sendEvent(this.orderEditionEvent, OrderEditionEventType.EDITION_MODE,
      { editionMode: this.editionMode });

    this.initOrderForEdition();
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
    this.orderForEdition = clone(order);
  }


  private isItemInOrden(item: OrderItem): boolean {
    return this.orderForEdition.items.some(x => this.isSameOrderItem(x, item));
  }


  private isSameOrderItem(item1: OrderItem, item2: OrderItem): boolean {
    return item1.vendor.vendorProductUID === item2.vendor.vendorProductUID
  }


  private fieldHasChanges(newItem: Identifiable, oldItem: Identifiable): boolean {
    return !isEmpty(newItem) && !isEmpty(oldItem) && newItem.uid !== oldItem.uid;
  }


  private validateOrderHeaderChanges(orderData: OrderData) {
    const recalculateItems = this.orderForEdition.items.length > 0 &&
      (this.fieldHasChanges(orderData.customer, this.orderForEdition.customer) ||
        this.fieldHasChanges(orderData.supplier, this.orderForEdition.supplier));

    this.setOrderForEdition({ ...this.orderForEdition, ...orderData });

    if (recalculateItems) {
      this.calculateOrder(this.orderForEdition);
    }
  }


  private addOrderItem(item: OrderItem) {
    if (this.isItemInOrden(item)) {
      this.showMessageItemInOrder(item);
      return;
    }

    const orderToRecalculate = clone(this.orderForEdition);
    orderToRecalculate.items.push(item);

    this.calculateOrder(orderToRecalculate);
  }


  private updateOrderItem(item: OrderItem) {
    const orderToRecalculate = clone(this.orderForEdition);
    const index = orderToRecalculate.items.findIndex(x => this.isSameOrderItem(x, item));

    if(index !== -1) orderToRecalculate.items[index] = item;

    this.calculateOrder(orderToRecalculate);
  }


  private removeOrderItem(item: OrderItem) {
    const orderToRecalculate = clone(this.orderForEdition);
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
    this.messageBox.showError('Ocurrió un error al procesar la orden.');
  }


  private invalidateForms() {
    this.orderHeader.invalidateForm();
    this.orderSummary.invalidateForm();
  }


  private showMessageItemInOrder(item: OrderItem) {
    const title = 'Producto duplicado en la orden';

    const message = `El producto ya se encuentra agregado, edite la cantidad en el detalle de la orden.<br>
      <table class="confirm-data">
        <tr><td>Clave: </td><td><strong>${item.product?.productCode}</strong></td></tr>
        <tr><td>Presentación: </td><td><strong>${item.presentation.description}</strong></td></tr>
        <tr><td>Proveedor: </td><td><strong>${item.vendor.vendorName}</strong></td></tr>
      </table>`;

    this.messageBox.show(message, title);
  }


  private emitOrderDirty(dirty: boolean) {
    sendEvent(this.orderEditionEvent, OrderEditionEventType.ORDER_DIRTY, { dirty });
  }

}
