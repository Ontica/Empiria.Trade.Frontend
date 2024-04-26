/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { InventoryOrdersDataService } from '@app/data-services';

import { EmptyInventoryOrder, EmptyInventoryOrderDataTable, EmptyInventoryOrderQuery, InventoryOrder,
         InventoryOrderDataTable, InventoryOrderQuery } from '@app/models';

import {
  InventoryOrdersExplorerEventType
} from '@app/views/inventory/inventory-orders-explorer/inventory-orders-explorer.component';

import {
  InventoryOrderTabbedViewEventType
} from '@app/views/inventory/inventory-order-tabbed-view/inventory-order-tabbed-view.component';

import {
  InventoryOrderCreatorEventType
} from '@app/views/inventory/inventory-order/inventory-order-creator.component';

@Component({
  selector: 'emp-trade-inventory-orders-main-page',
  templateUrl: './inventory-orders-main-page.component.html',
})
export class InventoryOrdersMainPageComponent {

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  query: InventoryOrderQuery = EmptyInventoryOrderQuery;

  inventoryOrdersData: InventoryOrderDataTable = Object.assign({}, EmptyInventoryOrderDataTable);

  inventoryOrderSelected: InventoryOrder = EmptyInventoryOrder;

  displayTabbedView = false;

  displayCreator = false;


  constructor(private inventoryData: InventoryOrdersDataService) { }


  onInventoryOrderCreatorEvent(event: EventInfo) {
    switch (event.type as InventoryOrderCreatorEventType) {
      case InventoryOrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as InventoryOrdersExplorerEventType) {
      case InventoryOrdersExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;

      case InventoryOrdersExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as InventoryOrderQuery;
        this.clearInventoryOrdersData();
        this.searchInventoryOrders(this.query);
        return;

      case InventoryOrdersExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getInventoryOrder(event.payload.entry.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as InventoryOrderTabbedViewEventType) {
      case InventoryOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.clearInventoryOrderSelected();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchInventoryOrders(query: InventoryOrderQuery) {
    this.isLoading = true;

    this.inventoryData.searchInventoryOrders(query)
      .firstValue()
      .then(x => this.resolveSearchInventoryOrders(x))
      .finally(() => this.isLoading = false);
  }



  private getInventoryOrder(inventoryOrderUID: string) {
    this.isLoadingSelection = true;

    this.inventoryData.getInventoryOrder(inventoryOrderUID)
      .firstValue()
      .then(x => this.setInventoryOrderSelected(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveSearchInventoryOrders(data: InventoryOrderDataTable) {
    this.setInventoryOrdersData(data, true);
    this.clearInventoryOrderSelected();
  }


  private setInventoryOrdersData(data: InventoryOrderDataTable, queryExecuted: boolean = true) {
    this.inventoryOrdersData = data;
    this.queryExecuted = queryExecuted;
  }


  private clearInventoryOrdersData() {
    this.setInventoryOrdersData(EmptyInventoryOrderDataTable, false);
  }


  private setInventoryOrderSelected(data: InventoryOrder) {
    this.inventoryOrderSelected = data;
    this.displayTabbedView = !isEmpty(this.inventoryOrderSelected);
  }


  private clearInventoryOrderSelected() {
    this.setInventoryOrderSelected(EmptyInventoryOrder);
  }

}
