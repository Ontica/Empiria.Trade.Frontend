/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { PurchasesDataService } from '@app/data-services';

import { DataTableEntry, EmptyOrdersDataTable, EmptyPurchaseOrdersQuery, OrdersDataTable,
         OrdersOperationCommand, OrdersTypeConfig, PurchaseOrdersOperationsList, PurchaseOrdersQuery,
         PurchaseOrdersQueryType } from '@app/models';

import { OrdersExplorerEventType } from '@app/views/orders/orders-explorer/orders-explorer.component';

import { PurchaseOrdersFilterEventType } from '../purchase-orders-filter/purchase-orders-filter.component';


@Component({
  selector: 'emp-trade-purchase-orders-main-page',
  templateUrl: './purchase-orders-main-page.component.html',
})
export class PurchaseOrdersMainPageComponent {

  purchasesConfig: OrdersTypeConfig = {
    type: PurchaseOrdersQueryType.Purchase,
    titleText: 'Ordenes de compra',
    itemText: 'Orden',
    canAdd: true,
  };

  isLoading = false;

  queryExecuted = false;

  query: PurchaseOrdersQuery = EmptyPurchaseOrdersQuery;

  isLoadingOrder = false;

  purchaseOrdersData: OrdersDataTable = Object.assign({}, EmptyOrdersDataTable);

  purchaseOrderSelected = null;

  operationsList = PurchaseOrdersOperationsList;

  operationCommandSeleted: OrdersOperationCommand = { orders: [], operation: null };

  displayOrderTabbedView = false;

  displayOrderCreator = false;


  constructor(private purchasesData: PurchasesDataService,
              private messageBox: MessageBoxService) {
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
        this.clearPurchaseOrderSelected();
        this.displayOrderCreator = true;
        this.messageBox.showInDevelopment('Agregar orden de compra');
        return;

      case OrdersExplorerEventType.SELECT_ORDER:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.messageBox.showInDevelopment('Seleccionar orden de compra');
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


  private searchPurchaseOrders(query: PurchaseOrdersQuery) {
    this.clearPurchaseOrdersData();

    this.purchasesData.searchOrders(query)
      .firstValue()
      .then(x => this.setPurchaseOrdersData(x, true))
      .finally(() => this.isLoading = false)
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


  private setPurchaseOrderSelected(order: any) {
    this.purchaseOrderSelected = order;
    this.displayOrderTabbedView = !!this.purchaseOrderSelected?.uid;
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
