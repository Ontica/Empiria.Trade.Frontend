/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptyOrder, Order, OrderStatus, getOrderStatusName } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

export enum OrdersTableEventType {
  ENTRY_CLICKED = 'OrdersTableComponent.Event.EntryClicked',
}

@Component({
  selector: 'emp-trade-orders-table',
  templateUrl: './orders-table.component.html',
})
export class OrdersTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() ordersList: Order[] = [];

  @Input() orderSelected: Order = EmptyOrder();

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() ordersTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['orderNumber', 'date', 'customer', 'status', 'vendor', 'total'];

  dataSource: TableVirtualScrollDataSource<Order>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.ordersList) {
      this.dataSource = new TableVirtualScrollDataSource(this.ordersList);
      this.scrollToTop();
    }
  }


  getOrderStatusName(status: OrderStatus): string {
    return getOrderStatusName(status);
  }


  onEntryClicked(entry: Order) {
    sendEvent(this.ordersTableEvent, OrdersTableEventType.ENTRY_CLICKED, { entry });
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
