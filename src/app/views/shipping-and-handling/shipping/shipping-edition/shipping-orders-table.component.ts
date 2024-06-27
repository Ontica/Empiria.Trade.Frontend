/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { SearcherAPIS } from '@app/data-services';

import { EmptyShipping, SaleOrderDescriptor, OrderForShipping, Shipping } from '@app/models';

import {
  SelectBoxTypeaheadComponent
} from '@app/shared/form-controls/select-box-typeahead/select-box-typeahead.component';

export enum ShippingOrdersTableEventType {
  CHANGE_ORDERS = 'ShippingOrdersTableComponent.Event.ChangeOrders',
  ADD_ORDER     = 'ShippingOrdersTableComponent.Event.AddOrder',
  REMOVE_ORDER  = 'ShippingOrdersTableComponent.Event.RemoveOrder',
  PRINT_ORDER   = 'ShippingOrdersTableComponent.Event.PrintOrder',
}

@Component({
  selector: 'emp-trade-shipping-orders-table',
  templateUrl: './shipping-orders-table.component.html',
})
export class ShippingOrdersTableComponent implements OnChanges {

  @ViewChild('orderSearcher') orderSearcher: SelectBoxTypeaheadComponent;

  @Input() shipping: Shipping = EmptyShipping;

  @Input() canEdit = false;

  @Input() canPrint = false;

  @Input() resetSearcher = false;

  @Input() showTitle: boolean = true;

  @Output() shippingOrdersTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['orderNumber', 'orderTotal',
                                       'totalPackages', 'totalWeight', 'totalVolume'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<OrderForShipping>;

  ordersForShippingAPI = SearcherAPIS.ordersForShipping;

  ordersForShipping: OrderForShipping[] = [];


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.ordersForShipping = [...this.shipping.ordersForShipping];
    this.setDataTable();
    this.resetColumns();
  }


  get isSaved(): boolean {
    return !!this.shipping.shippingData.shippingUID;
  }


  get hasItems(): boolean {
    return this.ordersForShipping.length > 0;
  }


  onOrderSearcherChanges(order: SaleOrderDescriptor) {
    setTimeout(() => {
      if (!this.isOrderInShipping(order.uid)) {
        this.addOrderToShipping(order.uid);
      } else {
        this.messageBox.showError('El pedido ya se encuentra en el envío.');
      }

      this.resetOrderSearcher();
    });
  }


  onRemoveOrderToShippingClicked(order: OrderForShipping) {
    setTimeout(() => {
      if (this.isOrderInShipping(order.orderUID)) {
        this.removeOrderToShipping(order.orderUID);
      }

      this.resetOrderSearcher();
    });
  }


  onPrintOrderClicked(order: OrderForShipping) {
    sendEvent(this.shippingOrdersTableEvent, ShippingOrdersTableEventType.PRINT_ORDER,
      { media: order.billingMedia });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.ordersForShipping);
  }


  private resetColumns() {
    this.displayedColumns = [];

    if (this.canPrint) {
      this.displayedColumns.push('actionPrint');
    }

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionEdit');
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


  private resetOrderSearcher() {
    if (this.resetSearcher) {
      this.orderSearcher.resetSearcherData();
    } else {
      this.orderSearcher.resetValue();
    }
  }

}
