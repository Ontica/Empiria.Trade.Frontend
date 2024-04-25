/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { InventoryOrdersDataService } from '@app/data-services';

import { EmptyInventoryOrderDataTable, InventoryOrderDataTable, InventoryOrderDescriptor,
         InventoryOrderQuery } from '@app/models';

import { InventoryOrdersFilterEventType } from './inventory-orders-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';


@Component({
  selector: 'emp-trade-inventory-orders-explorer',
  templateUrl: './inventory-orders-explorer.component.html',
})
export class InventoryOrdersExplorerComponent implements OnInit {

  inventoryOrderData: InventoryOrderDataTable = Object.assign({}, EmptyInventoryOrderDataTable);

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  queryExecuted = false;


  constructor(private inventoryOrdersData: InventoryOrdersDataService,
              private messageBox: MessageBoxService) {

  }


  ngOnInit() {
    this.setText();
  }


  onCreateOrderClicked() {
    this.messageBox.showInDevelopment('Agregar orden de inventario');
  }


  onInventoryOrdersFilterEvent(event: EventInfo) {
    switch (event.type as InventoryOrdersFilterEventType) {
      case InventoryOrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setInventoryOrdersData(EmptyInventoryOrderDataTable, false);
        this.searchInventoryOrders(event.payload.query as InventoryOrderQuery);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrdersDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');

        this.messageBox.showInDevelopment('Detalle de orden de inventario',
          event.payload.entry as InventoryOrderDescriptor);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchInventoryOrders(query: InventoryOrderQuery) {
    this.isLoading = true;

    this.inventoryOrdersData.searchInventoryOrders(query)
      .firstValue()
      .then(x => this.resolveSearchInventoryOrders(x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchInventoryOrders(data: InventoryOrderDataTable) {
    this.setInventoryOrdersData(data, true);
  }


  private setInventoryOrdersData(data: InventoryOrderDataTable, queryExecuted: boolean = true) {
    this.inventoryOrderData = data;
    this.queryExecuted = queryExecuted;

    this.setText();
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.inventoryOrderData.entries.length} registros encontrados`;
  }

}
