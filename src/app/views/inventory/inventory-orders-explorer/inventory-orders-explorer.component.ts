/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyInventoryOrder, EmptyInventoryOrderDataTable, InventoryOrder,
         InventoryOrderDataTable } from '@app/models';

import { InventoryOrdersFilterEventType } from './inventory-orders-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';


export enum InventoryOrdersExplorerEventType {
  CREATE_CLICKED = 'InventoryOrdersExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED = 'InventoryOrdersExplorerComponent.Event.SearchClicked',
  SELECT_CLICKED = 'InventoryOrdersExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-trade-inventory-orders-explorer',
  templateUrl: './inventory-orders-explorer.component.html',
})
export class InventoryOrdersExplorerComponent implements OnChanges {

  @Input() inventoryOrdersData: InventoryOrderDataTable = EmptyInventoryOrderDataTable;

  @Input() inventoryOrderSelected: InventoryOrder = EmptyInventoryOrder;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() inventoryOrdersExplorerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.inventoryOrderData) {
      this.setText();
    }
  }


  onCreateOrderClicked() {
    sendEvent(this.inventoryOrdersExplorerEvent, InventoryOrdersExplorerEventType.CREATE_CLICKED);
  }


  onInventoryOrdersFilterEvent(event: EventInfo) {
    switch (event.type as InventoryOrdersFilterEventType) {
      case InventoryOrdersFilterEventType.SEARCH_CLICKED:
        sendEvent(this.inventoryOrdersExplorerEvent, InventoryOrdersExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrdersDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        sendEvent(this.inventoryOrdersExplorerEvent, InventoryOrdersExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.inventoryOrdersData.entries.length} registros encontrados`;
  }

}
