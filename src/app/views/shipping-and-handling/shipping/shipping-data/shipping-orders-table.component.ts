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

import { ShippingDataService } from '@app/data-services';

import { EmptyShipping, OrderForShipping, Shipping } from '@app/models';

export enum ShippingOrdersTableEventType {
  CHANGE_DATA = 'ShippingOrdersTableComponent.Event.ChangeData',
}

@Component({
  selector: 'emp-trade-shipping-orders-table',
  templateUrl: './shipping-orders-table.component.html',
})
export class ShippingOrdersTableComponent implements OnChanges, OnInit {

  @Input() shipping: Shipping = EmptyShipping;

  @Input() showTitle: boolean = true;

  @Output() shippingOrdersTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['ID', 'orderName', 'orderTotal',
                                'totalPackages', 'totalWeight', 'totalVolume', 'action'];

  dataSource: MatTableDataSource<OrderForShipping>;

  orderForShippingToAdd: OrderForShipping = null;

  ordersList$: Observable<OrderForShipping[]>;

  ordersInput$ = new Subject<string>();

  isOrdersLoading = false;

  minTermLength = 5;

  ordersForShipping: OrderForShipping[] = [];


  constructor(private shippingData: ShippingDataService) {

  }


  ngOnChanges() {
    this.ordersForShipping = [...this.shipping.ordersForShipping];
    this.setDataTable();
  }


  ngOnInit() {
    this.subscribeOrdersSearch();
  }


  onOrderToAddChanges() {
    setTimeout(() => {
      if (!this.isOrderInShipping(this.orderForShippingToAdd.orderUID)) {
        this.addOrderToShipping();
      }

      this.resetOrderForShippingToAdd();
    });
  }


  onRemoveOrderToShippingClicked(order: OrderForShipping) {
    setTimeout(() => {
      if (this.isOrderInShipping(order.orderUID)) {
        this.removeOrderToShipping(order.orderUID);
      }

      this.resetOrderForShippingToAdd();
    });
  }


  private isOrderInShipping(orderUID: string): boolean {
    return this.ordersForShipping.some(x => x.orderUID === orderUID);
  }


  private addOrderToShipping() {
    this.ordersForShipping.push(this.orderForShippingToAdd);
    this.setDataTable();
    this.emitChangeData();
  }


  private removeOrderToShipping(orderUID: string) {
    this.ordersForShipping = this.ordersForShipping.filter(x => x.orderUID !== orderUID);
    this.setDataTable();
    this.emitChangeData();
  }


  private resetOrderForShippingToAdd() {
    this.orderForShippingToAdd = null;
    this.subscribeOrdersSearch();
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.ordersForShipping);
  }


  private subscribeOrdersSearch() {
    this.ordersList$ = concat(
      of([]),
      this.ordersInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.minTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.isOrdersLoading = true),
        switchMap(keyword =>
          this.shippingData.getOrdersForShipping(keyword)
            .pipe(
              delay(2000),
              catchError(() => of([])),
              tap(() => this.isOrdersLoading = false)
            )
        ))
    );
  }


  private emitChangeData() {
    const payload = {
      orders: this.ordersForShipping.map(x => x.orderUID),
    };

    sendEvent(this.shippingOrdersTableEvent, ShippingOrdersTableEventType.CHANGE_DATA, payload);
  }

}
