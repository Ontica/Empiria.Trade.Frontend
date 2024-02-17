/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AppStatusStateAction } from '@app/presentation/app-data/_app-data.presentation.types';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { ArrayLibrary, clone } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyOrder, EmptyOrderDataTable, EmptyOrderQuery, Order, OrderDataTable, OrderDescriptor, OrderQuery,
         OrderQueryType, OrderTypeConfig, OrdersOperationType, mapOrderDescriptorFromOrder } from '@app/models';

import { SalesOrdersDataService } from '@app/data-services';

import { OrdersExplorerEventType } from '@app/views/orders/orders-explorer/orders-explorer.component';

import { OrderCreatorEventType } from '@app/views/orders/order-creator/order-creator.component';

import { OrderTabbedViewEventType } from '@app/views/orders/order-tabbed-view/order-tabbed-view.component';

import {
  ShippingEditorModalEventType
} from '../shipping-and-handling/shipping/shipping-editor-modal/shipping-editor-modal.component';


interface OrderOperationCommand {
  operation: Identifiable;
  orders: string[];
}

@Component({
  selector: 'emp-trade-sales-main-page',
  templateUrl: './sales-main-page.component.html',
})
export class SalesMainPageComponent implements OnInit, OnDestroy {

  salesConfig: OrderTypeConfig = {
    type: OrderQueryType.Sales,
    titleText: 'Pedido',
    itemText: 'pedido',
    canAdd: false,
  };

  isLoading = false;

  queryExecuted = false;

  query: OrderQuery = EmptyOrderQuery;

  isLoadingOrder = false;

  ordersData: OrderDataTable = Object.assign({}, EmptyOrderDataTable);

  orderSelected: Order = EmptyOrder();

  operationCommandSeleted: OrderOperationCommand = { orders: [], operation: null }

  displayOrderTabbedView = false;

  displayOrderCreator = false;

  displayShippingEditor = false;

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private salesOrdersData: SalesOrdersDataService,
              private messageBox: MessageBoxService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.getCurrentView();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  onOrderCreatorEvent(event: EventInfo) {
    switch (event.type as OrderCreatorEventType) {
      case OrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayOrderCreator = false;
        return;

      case OrderCreatorEventType.ORDER_CREATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.displayOrderCreator = false;
        const orderCreated = event.payload.order as Order;
        this.insertOrderToList(orderCreated);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as OrdersExplorerEventType) {
      case OrdersExplorerEventType.CREATE_ORDER:
        this.clearOrderSelected();
        this.displayOrderCreator = true;
        return;

      case OrdersExplorerEventType.SEARCH_ORDERS:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as OrderQuery;
        this.clearOrderSelected();
        this.searchOrders(this.query);
        return;

      case OrdersExplorerEventType.CLEAR_ORDERS:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as OrderQuery;
        this.clearOrderSelected();
        this.setOrderDataEntries([], false);
        return;

      case OrdersExplorerEventType.SELECT_ORDER:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getOrder(event.payload.entry.uid);
        return;

      case OrdersExplorerEventType.EXECUTE_OPERATION:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.orders, 'event.payload.orders');
        this.validateDataOperationToInvoke(event.payload.operation, event.payload.orders);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;

    }
  }


  onOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as OrderTabbedViewEventType) {
      case OrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.clearOrderSelected();
        return;

      case OrderTabbedViewEventType.ORDER_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.insertOrderToList(event.payload.order ?? EmptyOrder() as Order);
        return;

      case OrderTabbedViewEventType.ORDER_CANCELED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.removeOrderFromList(event.payload.orderUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingEditorModalEvent(event: EventInfo) {
    switch (event.type as ShippingEditorModalEventType) {
      case ShippingEditorModalEventType.CLOSE_BUTTON_CLICKED:
        this.clearOperationCommandSelected();
        return;

      case ShippingEditorModalEventType.SHIPPING_SENT:
        this.searchOrders(this.query);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getCurrentView() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.validateCurrentView(x.name));
  }


  private validateCurrentView(view: string) {
    switch (view) {
      case 'VentasViews.Pedidos':
        this.setInitConfig(OrderQueryType.Sales, 'Pedidos', 'pedido', true);
        return;

      case 'VentasViews.Autorizaciones':
        this.setInitConfig(OrderQueryType.SalesAuthorization, 'Autorizaciones', '', false);
        return;

      case 'AlmacenesViews.Surtidos':
        this.setInitConfig(OrderQueryType.SalesPacking, 'Surtidos', '', false);
        return;

      default:
        return;
    }
  }


  private setInitConfig(type: OrderQueryType, titleText: string, itemText: string, canAdd: boolean) {
    this.salesConfig = { type, titleText, itemText, canAdd };
    this.query = Object.assign({}, EmptyOrderQuery, { queryType: type });
  }


  private searchOrders(query: OrderQuery) {
    this.clearData();

    this.salesOrdersData.searchOrders(query)
      .firstValue()
      .then(x => this.setOrderData(x))
      .finally(() => this.isLoading = false)
  }


  private getOrder(orderUID: string) {
    this.isLoadingOrder = true;

    this.salesOrdersData.getOrder(orderUID, this.salesConfig.type)
      .firstValue()
      .then(x => this.setOrderSelected(x))
      .finally(() => this.isLoadingOrder = false);
  }


  private setOrderData(data: OrderDataTable, queryExecuted: boolean = true) {
    this.ordersData = data;
    this.queryExecuted = queryExecuted;
    this.clearOperationCommandSelected();
  }


  private setOrderDataEntries(entries: OrderDescriptor[], queryExecuted: boolean = true) {
    this.ordersData = Object.assign({}, this.ordersData, { query: this.query, entries });
    this.queryExecuted = queryExecuted;
    this.clearOperationCommandSelected();
  }


  private clearData() {
    this.ordersData = Object.assign({}, this.ordersData,
      { query: this.query, columns: [], entries: [] });;
    this.isLoading = true;
    this.queryExecuted = false;
  }


  private setOrderSelected(order: Order) {
    this.orderSelected = clone<Order>(order);
    this.displayOrderTabbedView = !!this.orderSelected.orderData.uid;
  }


  private clearOrderSelected() {
    this.setOrderSelected(EmptyOrder());
  }


  private insertOrderToList(order: Order) {
    const orderToInsert = mapOrderDescriptorFromOrder(order);
    const ordersListNew = ArrayLibrary.insertItemTop(this.ordersData.entries, orderToInsert, 'uid');
    this.setOrderDataEntries(ordersListNew);
    this.setOrderSelected(order);
    this.setUserWorkStatusFinished();
  }


  private removeOrderFromList(orderUID: string) {
    const ordersListNew = this.ordersData.entries.filter(x => x.uid !== orderUID);
    this.setOrderDataEntries(ordersListNew);
    this.clearOrderSelected();
    this.setUserWorkStatusFinished();
  }


  private validateDataOperationToInvoke(operation: Identifiable, orders: string[]) {
    switch (operation.uid) {
      case OrdersOperationType.parcel_delivery:
        this.setOperationCommandSelected(operation, orders);
        this.clearOrderSelected();
        return;

      default:
        this.messageBox.showInDevelopment('Executar operación: ' + operation.name + orders.length,
          { operation, orders });
        return;
    }
  }


  private setOperationCommandSelected(operation: Identifiable, orders: string[]) {
    this.operationCommandSeleted = { operation, orders };
    this.displayShippingEditor = !isEmpty(operation) && orders.length > 0;
  }


  private clearOperationCommandSelected() {
    this.setOperationCommandSelected(null, []);
  }


  private setUserWorkStatusFinished() {
    this.uiLayer.dispatch(AppStatusStateAction.SET_IS_USER_WORKING, false);
  }

}
