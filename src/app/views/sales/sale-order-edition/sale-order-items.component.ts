/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { SaleOrderItem } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';


export enum SaleOrderItemsEventType {
  ADD_ORDER_ITEM_CLICKED    = 'SaleOrderItemsComponent.Event.AddOrderItemClicked',
  REMOVE_ORDER_ITEM_CLICKED = 'SaleOrderItemsComponent.Event.RemoveOrderItemClicked',
  UPDATE_ORDER_ITEM         = 'SaleOrderItemsComponent.Event.UpdateOrderItem',
}

@Component({
  selector: 'emp-trade-sale-order-items',
  templateUrl: './sale-order-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleOrderItemsComponent implements OnChanges {

  @Input() orderItems: SaleOrderItem[] = [];

  @Input() editionMode = false;

  @Input() canEdit = false;

  @Output() saleOrderItemsEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['product', 'description', 'quantity', 'unitPrice', 'salesPrice',
    'discountPolicy', 'discount1', 'discount2', 'subtotal'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<SaleOrderItem>;

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

    sendEvent(this.saleOrderItemsEvent, SaleOrderItemsEventType.ADD_ORDER_ITEM_CLICKED);
  }


  onRemoveOrderItemClicked(orderItem: SaleOrderItem) {
    sendEvent(this.saleOrderItemsEvent, SaleOrderItemsEventType.REMOVE_ORDER_ITEM_CLICKED, { orderItem });
  }


  onOrderItemChange(orderItem: SaleOrderItem) {
    sendEvent(this.saleOrderItemsEvent, SaleOrderItemsEventType.UPDATE_ORDER_ITEM, { orderItem });
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
