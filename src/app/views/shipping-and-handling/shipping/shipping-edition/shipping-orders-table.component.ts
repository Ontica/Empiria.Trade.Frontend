/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Observable, Subject, catchError, concat, debounceTime, delay, distinctUntilChanged, filter, of,
         switchMap, tap } from 'rxjs';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { SalesOrdersDataService } from '@app/data-services';

import { EmptyShipping, OrderDescriptor, OrderForShipping, Shipping } from '@app/models';

export enum ShippingOrdersTableEventType {
  CHANGE_ORDERS = 'ShippingOrdersTableComponent.Event.ChangeOrders',
  ADD_ORDER     = 'ShippingOrdersTableComponent.Event.AddOrder',
  REMOVE_ORDER  = 'ShippingOrdersTableComponent.Event.RemoveOrder',
}

@Component({
  selector: 'emp-trade-shipping-orders-table',
  templateUrl: './shipping-orders-table.component.html',
})
export class ShippingOrdersTableComponent implements OnChanges, OnInit {

  @Input() shipping: Shipping = EmptyShipping;

  @Input() canEdit = false;

  @Input() showTitle: boolean = true;

  @Output() shippingOrdersTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['orderNumber', 'orderTotal',
                                       'totalPackages', 'totalWeight', 'totalVolume'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<OrderForShipping>;

  orderFromSearcher: OrderDescriptor = null;

  ordersList$: Observable<OrderDescriptor[]>;

  ordersInput$ = new Subject<string>();

  isOrdersLoading = false;

  minTermLength = 5;

  ordersForShipping: OrderForShipping[] = [];


  constructor(private orderData: SalesOrdersDataService,
              private messageBox: MessageBoxService) {

  }


  ngOnChanges() {
    this.ordersForShipping = [...this.shipping.ordersForShipping];
    this.setDataTable();
    this.resetColumns();
  }


  ngOnInit() {
    this.subscribeSearchOrders();
  }


  get isSaved(): boolean {
    return !!this.shipping.shippingData.shippingUID;
  }


  get hasItems(): boolean {
    return this.ordersForShipping.length > 0;
  }


  onOrderSearcherChanges() {
    setTimeout(() => {
      if (!this.isOrderInShipping(this.orderFromSearcher.uid)) {
        this.addOrderToShipping(this.orderFromSearcher.uid);
      } else {
        this.messageBox.showError('El pedido ya se encuentra en el envío.');
      }

      this.resetSearchOrders();
    });
  }


  onRemoveOrderToShippingClicked(order: OrderForShipping) {
    setTimeout(() => {
      if (this.isOrderInShipping(order.orderUID)) {
        this.removeOrderToShipping(order.orderUID);
      }

      this.resetSearchOrders();
    });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.ordersForShipping);
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('action');
    }
  }


  private isOrderInShipping(orderUID: string): boolean {
    return this.ordersForShipping.some(x => x.orderUID === orderUID);
  }


  private addOrderToShipping(orderUID: string) {
    if (this.isSaved) {
      sendEvent(this.shippingOrdersTableEvent, ShippingOrdersTableEventType.ADD_ORDER,
        { shippingUID: this.shipping.shippingData.shippingUID, orderUID });
    } else {
      const orders = [...this.ordersForShipping.map(x => x.orderUID), orderUID];
      this.emitUpdateOrders(orders);
    }
  }


  private removeOrderToShipping(orderUID: string) {
    if (this.isSaved) {
      sendEvent(this.shippingOrdersTableEvent, ShippingOrdersTableEventType.REMOVE_ORDER,
        { shippingUID: this.shipping.shippingData.shippingUID, orderUID });
    } else {
      const orders = this.ordersForShipping.map(x => x.orderUID).filter(x => x !== orderUID);
      this.emitUpdateOrders(orders);
    }
  }


  private emitUpdateOrders(orders: string[]) {
    sendEvent(this.shippingOrdersTableEvent, ShippingOrdersTableEventType.CHANGE_ORDERS, { orders });
  }


  private resetSearchOrders() {
    this.orderFromSearcher = null;
    this.subscribeSearchOrders();
  }


  private subscribeSearchOrders() {
    this.ordersList$ = concat(
      of([]),
      this.ordersInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.minTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.isOrdersLoading = true),
        switchMap(keyword =>
          this.orderData.searchOrdersForShipping(keyword.trim())
            .pipe(
              delay(2000),
              catchError(() => of([])),
              tap(() => this.isOrdersLoading = false)
            )
        ))
    );
  }

}
