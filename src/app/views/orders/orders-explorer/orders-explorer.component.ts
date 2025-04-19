/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ApplicationStatusService, Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { DefaultOrdersTypeConfig, EmptyOrdersDataTable, OrdersDataTable, OrdersTypeConfig,
         OrdersOperation} from '@app/models';

import { OrdersControlsEventType } from './orders-controls.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum OrdersExplorerEventType {
  CREATE_ORDER      = 'OrdersExplorerComponent.Event.CreateOrder',
  SELECT_ORDER      = 'OrdersExplorerComponent.Event.SelectOrder',
  EXECUTE_OPERATION = 'OrdersExplorerComponent.Event.ExecuteOperation',
}

@Component({
  selector: 'emp-trade-orders-explorer',
  templateUrl: './orders-explorer.component.html',
})
export class OrdersExplorerComponent implements OnChanges {

  @Input() config: OrdersTypeConfig = DefaultOrdersTypeConfig;

  @Input() data: OrdersDataTable = Object.assign({}, EmptyOrdersDataTable);

  @Input() selectedUID = null;

  @Input() operationsList: OrdersOperation[] = [];

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Input() canSelectOrders = false;

  @Output() ordersExplorerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  ordersSelected: string[] = [];


  constructor(private appStatus: ApplicationStatusService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
      this.resetOrderSelected();
    }
  }


  onCreateOrderClicked() {
    this.appStatus.canUserContinue()
      .subscribe(x =>
        x ? sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.CREATE_ORDER) : null
      );
  }


  onOrdersControlsEvent(event: EventInfo) {
    switch (event.type as OrdersControlsEventType) {
      case OrdersControlsEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.orders, 'event.payload.orders');

        sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.EXECUTE_OPERATION, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');

        this.appStatus.canUserContinue()
          .subscribe(x =>
            x ? sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.SELECT_ORDER, event.payload) : null
          );

        return;

      case DataTableEventType.CHECKBOX_SELECTION_CHANGED:
        Assertion.assertValue(event.payload.entries, 'event.payload.entries');
        this.ordersSelected = event.payload.entries;
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

    this.cardHint = `${this.data.entries.length} registros encontrados`;
  }


  private resetOrderSelected() {
    this.ordersSelected = [];
  }

}
