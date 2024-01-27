/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { SelectionModel } from '@angular/cdk/collections';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { ApplicationStatusService, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyOrder, Order, OrderDescriptor, OrderQueryType } from '@app/models';

export enum OrdersTableEventType {
  ENTRY_CLICKED     = 'OrdersTableComponent.Event.EntryClicked',
  SELECTION_CHANGED = 'OrdersTableComponent.Event.SelectionChanged',
}

@Component({
  selector: 'emp-trade-orders-table',
  templateUrl: './orders-table.component.html',
})
export class OrdersTableComponent implements OnChanges, OnInit {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() orderType: OrderQueryType = OrderQueryType.Sales;

  @Input() ordersList: OrderDescriptor[] = [];

  @Input() orderSelected: Order = EmptyOrder();

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() ordersTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['orderNumber', 'date', 'customer', 'status',
                                       'vendor', 'total'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: TableVirtualScrollDataSource<OrderDescriptor>;

  selection = new SelectionModel<OrderDescriptor>(true, []);


  constructor(private appStatus: ApplicationStatusService) { }


  ngOnInit() {
    this.suscribeToSelectionChanges();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.ordersList) {
      this.clearSelection();
      this.setDataTable();
      this.resetColumns();
      this.scrollToTop();
    }
  }


  get hasItems(): boolean {
    return !!this.dataSource && this.dataSource?.data.length > 0;
  }


  onEntryClicked(entry: Order) {
    this.appStatus.canUserContinue()
      .subscribe(x =>
        x ? sendEvent(this.ordersTableEvent, OrdersTableEventType.ENTRY_CLICKED, { entry }) : null
      );
  }


  private setDataTable() {
    this.dataSource = new TableVirtualScrollDataSource(this.ordersList);
  }


  private resetColumns() {
    switch (this.orderType) {
      case OrderQueryType.Sales:
        this.displayedColumns = ['selection', ...this.displayedColumnsDefault];
        return;

      case OrderQueryType.SalesAuthorization:
        this.displayedColumns = [...this.displayedColumnsDefault, 'totalDebt'];
        return;

      case OrderQueryType.SalesPacking:
        this.displayedColumns = [...this.displayedColumnsDefault, 'weight', 'totalPackages'];
        return;
    }
  }


  private suscribeToSelectionChanges() {
    this.selection.changed.subscribe(x => {
      const payload = { orders: this.selection.selected.map(x => x.uid) };
      sendEvent(this.ordersTableEvent, OrdersTableEventType.SELECTION_CHANGED, payload);
    });
  }


  private clearSelection() {
    this.selection.clear();
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
