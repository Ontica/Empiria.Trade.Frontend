/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { PurchasesDataService } from '@app/data-services';

import { DataTableEntry, EmptyOrdersDataTable, EmptyPurchaseOrder, EmptyPurchaseOrdersQuery, OrdersDataTable,
         OrdersOperationCommand, OrdersQueryType, OrdersTypeConfig, PurchaseOrder,
         PurchaseOrdersOperationsList, PurchaseOrdersQuery } from '@app/models';

import { OrdersExplorerEventType } from '@app/views/orders/orders-explorer/orders-explorer.component';

import { PurchaseOrdersFilterEventType } from '../purchase-orders-filter/purchase-orders-filter.component';

import { PurchaseOrderCreatorEventType } from '../purchase-order/purchase-order-creator.component';

import {
  PurchaseOrderTabbedViewEventType
} from '../purchase-order-tabbed-view/purchase-order-tabbed-view.component';


@Component({
  selector: 'emp-trade-purchase-orders-main-page',
  templateUrl: './purchase-orders-main-page.component.html',
})
export class PurchaseOrdersMainPageComponent {

  purchasesConfig: OrdersTypeConfig = {
    type: OrdersQueryType.Purchase,
    titleText: 'Ordenes de compra',
    itemText: 'Orden',
    canAdd: true,
  };

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  query: PurchaseOrdersQuery = EmptyPurchaseOrdersQuery;

  purchaseOrdersData: OrdersDataTable = Object.assign({}, EmptyOrdersDataTable);

  purchaseOrderSelected: PurchaseOrder = EmptyPurchaseOrder;

  operationsList = PurchaseOrdersOperationsList;

  operationCommandSeleted: OrdersOperationCommand = { orders: [], operation: null };

  displayTabbedView = false;

  displayCreator = false;


  constructor(private purchasesData: PurchasesDataService,
              private messageBox: MessageBoxService) {
  }


  onPurchaseOrderCreatorEvent(event: EventInfo) {
    switch (event.type as PurchaseOrderCreatorEventType) {
      case PurchaseOrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;

      case PurchaseOrderCreatorEventType.ORDER_CREATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.displayCreator = false;
        this.setPurchaseOrderSelected(event.payload.order as PurchaseOrder);
        this.validateQueryForRefreshPurchaseOrders(this.purchaseOrderSelected.orderNumber);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPurchaseOrdersFilterEvent(event: EventInfo) {
    switch (event.type as PurchaseOrdersFilterEventType) {
      case PurchaseOrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as PurchaseOrdersQuery;
        this.clearPurchaseOrderSelected();
        this.searchPurchaseOrders(this.query);
        return;

      case PurchaseOrdersFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as PurchaseOrdersQuery;
        this.clearPurchaseOrderSelected();
        this.setPurchaseOrdersDataEntries([], false);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as OrdersExplorerEventType) {
      case OrdersExplorerEventType.CREATE_ORDER:
        this.displayCreator = true;
        return;

      case OrdersExplorerEventType.SELECT_ORDER:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getPurchaseOrder(event.payload.entry.uid);
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


  onPurchaseOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as PurchaseOrderTabbedViewEventType) {
      case PurchaseOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.clearPurchaseOrderSelected();
        return;

      case PurchaseOrderTabbedViewEventType.ORDER_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.refreshPurchaseOrders();
        this.setPurchaseOrderSelected(event.payload.order as PurchaseOrder);
        return;

      case PurchaseOrderTabbedViewEventType.ORDER_DELETED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.refreshPurchaseOrders();
        this.clearPurchaseOrderSelected();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateQueryForRefreshPurchaseOrders(keywords: string) {
    const newQuery: PurchaseOrdersQuery = {
      queryType: this.query.queryType,
      supplierUID: '',
      status: '',
      keywords,
    };

    this.query = Object.assign({}, this.query, newQuery);

    this.refreshPurchaseOrders();
  }


  private refreshPurchaseOrders() {
    this.searchPurchaseOrders(this.query);
  }


  private searchPurchaseOrders(query: PurchaseOrdersQuery) {
    this.clearPurchaseOrdersData();

    this.purchasesData.searchOrders(query)
      .firstValue()
      .then(x => this.setPurchaseOrdersData(x, true))
      .finally(() => this.isLoading = false)
  }


  private getPurchaseOrder(orderUID: string) {
    this.isLoadingSelection = true;

    this.purchasesData.getOrder(orderUID)
      .firstValue()
      .then(x => this.setPurchaseOrderSelected(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private setPurchaseOrdersData(data: OrdersDataTable, queryExecuted: boolean = true) {
    this.purchaseOrdersData = data;
    this.queryExecuted = queryExecuted;
    this.clearOperationCommandSelected();
  }


  private setPurchaseOrdersDataEntries(entries: DataTableEntry[], queryExecuted: boolean = true) {
    this.purchaseOrdersData = Object.assign({}, this.purchaseOrdersData, { query: this.query, entries });
    this.queryExecuted = queryExecuted;
    this.clearOperationCommandSelected();
  }


  private clearPurchaseOrdersData() {
    this.purchaseOrdersData = Object.assign({}, this.purchaseOrdersData,
      { query: this.query, columns: [], entries: [] });;
    this.isLoading = true;
    this.queryExecuted = false;
  }


  private setPurchaseOrderSelected(order: PurchaseOrder) {
    this.purchaseOrderSelected = order;
    this.displayTabbedView = !isEmpty(this.purchaseOrderSelected);
  }


  private clearPurchaseOrderSelected() {
    this.setPurchaseOrderSelected(null);
  }


  private validateDataOperationToInvoke(operation: Identifiable, orders: string[]) {
    switch (operation?.uid) {

      default:
        this.messageBox.showInDevelopment('Ejecutar operación: ' + operation.name + ' ( ' + orders.length + ' pedido )',
          { operation, orders });
        return;
    }
  }


  private setOperationCommandSelected(operation: Identifiable, orders: string[]) {
    this.operationCommandSeleted = { operation, orders };
  }


  private clearOperationCommandSelected() {
    this.setOperationCommandSelected(null, []);
  }

}
