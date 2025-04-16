/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { SaleOrderItem } from '@app/models';


export enum SaleOrderItemsEventType {
  ADD_ORDER_ITEM_CLICKED    = 'SaleOrderItemsComponent.Event.AddOrderItemClicked',
  REMOVE_ORDER_ITEM_CLICKED = 'SaleOrderItemsComponent.Event.RemoveOrderItemClicked',
  UPDATE_ORDER_ITEM         = 'SaleOrderItemsComponent.Event.UpdateOrderItem',
  SHOW_INVALID_DATA         = 'SaleOrderItemsComponent.Event.ShowInvalidData',
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
      this.showInvalidDataMessage('Agregar producto');
      return;
    }

    sendEvent(this.saleOrderItemsEvent, SaleOrderItemsEventType.ADD_ORDER_ITEM_CLICKED);
  }


  onRemoveOrderItemClicked(orderItem: SaleOrderItem) {
    if (!this.canEdit) {
      this.showInvalidDataMessage('Eliminar producto');
      return;
    }

    sendEvent(this.saleOrderItemsEvent, SaleOrderItemsEventType.REMOVE_ORDER_ITEM_CLICKED, { orderItem });
  }


  onOrderItemChange(orderItem: SaleOrderItem) {
    if (!this.canEdit) {
      this.showInvalidDataMessage('Editar producto');
    }

    sendEvent(this.saleOrderItemsEvent, SaleOrderItemsEventType.UPDATE_ORDER_ITEM, { orderItem });
  }


  private showInvalidDataMessage(title: string) {
    sendEvent(this.saleOrderItemsEvent, SaleOrderItemsEventType.SHOW_INVALID_DATA);
    this.messageBox.show('Seleccione los datos del pedido para continuar.', title);
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
