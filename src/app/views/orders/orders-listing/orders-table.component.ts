/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { ApplicationStatusService, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyOrder, Order, OrderDescriptor, OrderQueryType } from '@app/models';


export enum OrdersTableEventType {
  ENTRY_CLICKED = 'OrdersTableComponent.Event.EntryClicked',
}

@Component({
  selector: 'emp-trade-orders-table',
  templateUrl: './orders-table.component.html',
})
export class OrdersTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() orderType: OrderQueryType = OrderQueryType.Sales;

  @Input() ordersList: OrderDescriptor[] = [];

  @Input() orderSelected: Order = EmptyOrder();

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() ordersTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['orderNumber', 'date', 'customer', 'status', 'vendor', 'total'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: TableVirtualScrollDataSource<OrderDescriptor>;


  constructor(private appStatus: ApplicationStatusService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.ordersList) {
      this.dataSource = new TableVirtualScrollDataSource(this.ordersList);
      this.resetColumns();
      this.scrollToTop();
    }
  }


  onEntryClicked(entry: Order) {
    this.appStatus.canUserContinue()
      .subscribe(x =>
        x ? sendEvent(this.ordersTableEvent, OrdersTableEventType.ENTRY_CLICKED, { entry }) : null
      );
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    switch (this.orderType) {
      case OrderQueryType.SalesAuthorization:
        this.displayedColumns.push('totalDebt');
        return;

      case OrderQueryType.SalesPacking:
        this.displayedColumns.push('weight');
        this.displayedColumns.push('totalPackages');
        return;
    }
  }

}
