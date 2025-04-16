/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output,
         SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Assertion, EventInfo } from '@app/core';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { EmptyPurchaseOrderTotals, PurchaseOrderItem, PurchaseOrderItemFields,
         PurchaseOrderTotals } from '@app/models';


export enum PurchaseOrderItemsTableEventType {
  UPDATE_ITEM_CLICKED = 'PurchaseOrderItemsTableComponent.Event.UpdateItemClicked',
  REMOVE_ITEM_CLICKED = 'PurchaseOrderItemsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-trade-purchase-order-items-table',
  templateUrl: './purchase-order-items-table.component.html',
  styles: [`
    .product-input-numeric {
      min-width: 100px;
      width: 100px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrderItemsTableComponent implements OnChanges {

  @Input() orderItems: PurchaseOrderItem[] = [];

  @Input() orderTotals: PurchaseOrderTotals = EmptyPurchaseOrderTotals;

  @Input() canEdit = false;

  @Output() purchaseOrderItemsTableEvent = new EventEmitter<EventInfo>();

  editionMode = false;

  rowInEdition: PurchaseOrderItem = null;

  displayedColumnsDefault: string[] = ['product', 'notes', 'quantity', 'price', 'weight', 'total'];

  displayedColumns = [...this.displayedColumnsDefault];

  displayedTotalColumnsDefault: string[] = ['totalsItemsCount', 'totalsOrderTotal'];

  displayedTotalColumns: string[] = [...this.displayedTotalColumnsDefault];

  dataSource: MatTableDataSource<PurchaseOrderItem>;


  constructor(private messageBox: MessageBoxService) {

  }


  get hasOrderItems(): boolean {
    return this.orderItems.length > 0;
  }


  get isItemInEditionValid(): boolean {
    return this.rowInEdition.quantity > 0;
  }


  isRowInEdition(rowInEditionUID: string): boolean {
    return this.editionMode && rowInEditionUID === this.rowInEdition?.uid;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderItems) {
      this.resetEditionMode();
      this.setDataTable();
    }
  }


  onEditItemClicked(item: PurchaseOrderItem) {
    this.rowInEdition = {...{}, ...item};
    this.editionMode = true;
  }


  onCancelEditionClicked() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  onUpdateItemClicked() {
    const payload = {
      orderItemUID: this.rowInEdition.uid,
      dataFields: this.getDataFields(),
    };

    sendEvent(this.purchaseOrderItemsTableEvent, PurchaseOrderItemsTableEventType.UPDATE_ITEM_CLICKED,
      payload);
  }


  onDeleteItemClicked(item: PurchaseOrderItem) {
    const message = this.getConfirmDeleteMessage(item);

    this.messageBox.confirm(message, 'Eliminar producto', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.purchaseOrderItemsTableEvent, PurchaseOrderItemsTableEventType.REMOVE_ITEM_CLICKED,
            { orderItemUID: item.uid });
        }
      });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.orderItems ?? []);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];
    this.displayedTotalColumns = [...this.displayedTotalColumnsDefault];


    if (this.canEdit) {
      this.displayedColumns.push('actions');
      this.displayedTotalColumns.push('totalsActions');
    }
  }


  private resetEditionMode() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  private getConfirmDeleteMessage(item: PurchaseOrderItem): string {
    const quantity = FormatLibrary.numberWithCommas(item.quantity, '1.0-2');
    const price = !item.price ? '-' : FormatLibrary.numberWithCommas(item.price, '1.2-2');
    const weight = !item.weight ? '-' : FormatLibrary.numberWithCommas(item.weight, '1.2-2');

    return `
      <table class="confirm-data">

        <tr><td>Producto: </td><td>
          <strong> ${item.productCode} <span class="tag tag-small"> ${item.presentationName} </span> </strong>
        </td></tr>

        <tr><td class='nowrap'>Cantidad: </td><td><strong> ${quantity} </strong></td></tr>
        <tr><td class='nowrap'>Costo: </td><td><strong> ${price} </strong></td></tr>
        <tr><td class='nowrap'>Peso: </td><td><strong> ${weight} </strong></td></tr>

      </table>

     <br>¿Elimino el producto?`;
  }


  private getDataFields(): PurchaseOrderItemFields {
    Assertion.assert(this.isItemInEditionValid, 'Programming error: form must be validated before command execution.');

    const data: PurchaseOrderItemFields = {
      vendorProductUID: this.rowInEdition.vendorProductUID ?? '',
      quantity: this.rowInEdition.quantity ?? null,
      price: this.rowInEdition.price ?? null,
      weight: this.rowInEdition.weight ?? null,
      notes: this.rowInEdition.notes ?? null,
    };

    return data;
  }

}
