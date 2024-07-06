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

import { EmptySaleOrder, EmptyOrdersDataTable, EmptySalesOrdersQuery, SaleOrder, OrdersDataTable,
         DataTableEntry, SalesOrdersQuery, OrdersTypeConfig, SalesOrdersOperationType, SalesOrdersQueryType,
         mapSaleOrderDescriptorFromSaleOrder, SalesOrdersOperationsList,
         OrdersOperationCommand } from '@app/models';

import { SalesDataService } from '@app/data-services';

import { OrdersExplorerEventType } from '@app/views/orders/orders-explorer/orders-explorer.component';

import { SaleOrderCreatorEventType } from '../sale-order/sale-order-creator.component';

import {
  ShippingEditorModalEventType
} from '../../shipping-and-handling/shipping/shipping-editor-modal/shipping-editor-modal.component';

import { SalesOrdersFilterEventType } from '../sales-orders-filter/sales-orders-filter.component';

import { SaleOrderTabbedViewEventType } from '../sale-order-tabbed-view/sale-order-tabbed-view.component';

@Component({
  selector: 'emp-trade-sales-orders-main-page',
  templateUrl: './sales-orders-main-page.component.html',
})
export class SalesOrdersMainPageComponent implements OnInit, OnDestroy {

  salesConfig: OrdersTypeConfig = {
    type: SalesOrdersQueryType.Sales,
    titleText: 'Pedido',
    itemText: 'pedido',
    canAdd: false,
  };

  isLoading = false;

  queryExecuted = false;

  query: SalesOrdersQuery = EmptySalesOrdersQuery;

  isLoadingSelection = false;

  salesOrdersData: OrdersDataTable = Object.assign({}, EmptyOrdersDataTable);

  saleOrderSelected: SaleOrder = EmptySaleOrder();

  operationsList = SalesOrdersOperationsList;

  operationCommandSeleted: OrdersOperationCommand = { orders: [], operation: null }

  displayOrderTabbedView = false;

  displayOrderCreator = false;

  displayShippingEditor = false;

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private salesData: SalesDataService,
              private messageBox: MessageBoxService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.getCurrentView();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  get canSelectOrders(): boolean {
    return this.salesConfig.type === SalesOrdersQueryType.Sales;
  }


  onSaleOrderCreatorEvent(event: EventInfo) {
    switch (event.type as SaleOrderCreatorEventType) {
      case SaleOrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayOrderCreator = false;
        return;

      case SaleOrderCreatorEventType.ORDER_CREATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.displayOrderCreator = false;
        const orderCreated = event.payload.order as SaleOrder;
        this.insertOrderToList(orderCreated);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSalesOrdersFilterEvent(event: EventInfo) {
    switch (event.type as SalesOrdersFilterEventType) {
      case SalesOrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as SalesOrdersQuery;
        this.clearSaleOrderSelected();
        this.searchSalesOrders(this.query);
        return;

      case SalesOrdersFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as SalesOrdersQuery;
        this.clearSaleOrderSelected();
        this.setSalesOrdersDataEntries([], false);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as OrdersExplorerEventType) {
      case OrdersExplorerEventType.CREATE_ORDER:
        this.clearSaleOrderSelected();
        this.displayOrderCreator = true;
        return;

      case OrdersExplorerEventType.SELECT_ORDER:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getSaleOrder(event.payload.entry.uid);
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


  onSaleOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as SaleOrderTabbedViewEventType) {
      case SaleOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.clearSaleOrderSelected();
        return;

      case SaleOrderTabbedViewEventType.ORDER_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.insertOrderToList(event.payload.order ?? EmptySaleOrder() as SaleOrder);
        return;

      case SaleOrderTabbedViewEventType.ORDER_CANCELED:
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
      case ShippingEditorModalEventType.SHIPPING_DELETED:
        this.searchSalesOrders(this.query);
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
        this.setInitConfig(SalesOrdersQueryType.Sales, 'Pedidos', 'pedido', true);
        return;

      case 'VentasViews.Autorizaciones':
        this.setInitConfig(SalesOrdersQueryType.SalesAuthorization, 'Autorizaciones', '', false);
        return;

      case 'AlmacenesViews.Surtidos':
        this.setInitConfig(SalesOrdersQueryType.SalesPacking, 'Surtidos', '', false);
        return;

      default:
        return;
    }
  }


  private setInitConfig(type: SalesOrdersQueryType, titleText: string, itemText: string, canAdd: boolean) {
    this.salesConfig = { type, titleText, itemText, canAdd };
    this.query = Object.assign({}, EmptySalesOrdersQuery, { queryType: type });
  }


  private searchSalesOrders(query: SalesOrdersQuery) {
    this.clearSalesOrdersData();

    this.salesData.searchOrders(query)
      .firstValue()
      .then(x => this.setSalesOrdersData(x))
      .finally(() => this.isLoading = false)
  }


  private getSaleOrder(orderUID: string) {
    this.isLoadingSelection = true;

    this.salesData.getOrder(orderUID, this.salesConfig.type)
      .firstValue()
      .then(x => this.setSaleOrderSelected(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private setSalesOrdersData(data: OrdersDataTable, queryExecuted: boolean = true) {
    this.salesOrdersData = data;
    this.queryExecuted = queryExecuted;
    this.clearOperationCommandSelected();
  }


  private setSalesOrdersDataEntries(entries: DataTableEntry[], queryExecuted: boolean = true) {
    this.salesOrdersData = Object.assign({}, this.salesOrdersData, { query: this.query, entries });
    this.queryExecuted = queryExecuted;
    this.clearOperationCommandSelected();
  }


  private clearSalesOrdersData() {
    this.salesOrdersData = Object.assign({}, this.salesOrdersData,
      { query: this.query, columns: [], entries: [] });;
    this.isLoading = true;
    this.queryExecuted = false;
  }


  private setSaleOrderSelected(order: SaleOrder) {
    this.saleOrderSelected = clone<SaleOrder>(order);
    this.displayOrderTabbedView = !!this.saleOrderSelected.orderData.uid;
  }


  private clearSaleOrderSelected() {
    this.setSaleOrderSelected(EmptySaleOrder());
  }


  private insertOrderToList(order: SaleOrder) {
    if (this.queryExecuted) {
      const orderToInsert = mapSaleOrderDescriptorFromSaleOrder(order);
      const ordersListNew = ArrayLibrary.insertItemTop(this.salesOrdersData.entries, orderToInsert, 'uid');
      this.setSalesOrdersDataEntries(ordersListNew);
    }
    this.setSaleOrderSelected(order);
    this.setUserWorkStatusFinished();
  }


  private removeOrderFromList(orderUID: string) {
    const ordersListNew = this.salesOrdersData.entries.filter(x => x.uid !== orderUID);
    this.setSalesOrdersDataEntries(ordersListNew);
    this.clearSaleOrderSelected();
    this.setUserWorkStatusFinished();
  }


  private validateDataOperationToInvoke(operation: Identifiable, orders: string[]) {
    switch (operation.uid) {
      case SalesOrdersOperationType.parcel_delivery:
        this.setOperationCommandSelected(operation, orders);
        this.clearSaleOrderSelected();
        return;

      default:
        this.messageBox.showInDevelopment('Executar operación: ' + operation.name + ' ( ' + orders.length + ' pedido )',
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
