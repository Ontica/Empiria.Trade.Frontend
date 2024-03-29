/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { OrderItem } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';


export enum OrderItemsEventType {
  ADD_ORDER_ITEM_CLICKED    = 'OrderItemsComponent.Event.AddOrderItemClicked',
  REMOVE_ORDER_ITEM_CLICKED = 'OrderItemsComponent.Event.RemoveOrderItemClicked',
  UPDATE_ORDER_ITEM         = 'OrderItemsComponent.Event.UpdateOrderItem',
}

@Component({
  selector: 'emp-trade-order-items',
  templateUrl: './order-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemsComponent implements OnChanges {

  @Input() orderItems: OrderItem[] = [];

  @Input() editionMode = false;

  @Input() canEdit = false;

  @Output() orderItemsEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['product', 'description', 'quantity', 'unitPrice', 'salesPrice',
    'discountPolicy', 'discount1', 'discount2', 'subtotal'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<OrderItem>;

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.setDataTable();
  }


  get hasItems(): boolean {
    return this.orderItems.length > 0;
  }


  onAddOrderItemClicked() {
    if (!this.canEdit) {
      this.messageBox.show('Seleccione los datos del pedido para continuar.', 'Agregar producto');
      return;
    }

    sendEvent(this.orderItemsEvent, OrderItemsEventType.ADD_ORDER_ITEM_CLICKED);
  }


  onRemoveOrderItemClicked(orderItem: OrderItem) {
    sendEvent(this.orderItemsEvent, OrderItemsEventType.REMOVE_ORDER_ITEM_CLICKED, { orderItem });
  }


  onOrderItemChange(orderItem: OrderItem) {
    sendEvent(this.orderItemsEvent, OrderItemsEventType.UPDATE_ORDER_ITEM, { orderItem });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.orderItems ?? []);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [];

    if (this.editionMode) {
      this.displayedColumns.push('actionDelete');
    }

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];
  }

}
