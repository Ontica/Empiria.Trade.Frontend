/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { InventoryOrderItem, InventoryOrderItemQuantityFields, OrderItem } from '@app/models';

import { InputNumericComponent } from '@app/shared/form-controls';


export enum InventoryOrderItemsTableEventType {
  SELECT_ITEM_CLICKED       = 'InventoryOrderItemsTableComponent.Event.SelectItemClicked',
  UPDATE_ITEM_CLICKED       = 'InventoryOrderItemsTableComponent.Event.UpdateItemClicked',
  REMOVE_ITEM_CLICKED       = 'InventoryOrderItemsTableComponent.Event.RemoveItemClicked',
  EDIT_ITEM_ENTRIES_CLICKED = 'InventoryOrderItemsTableComponent.Event.EditItemEntriesClicked',
  EXPORT_REPORT_CLICKED     = 'InventoryOrderItemsTableComponent.Event.ExportReportClicked',
}

@Component({
  selector: 'emp-trade-inventory-order-items-table',
  templateUrl: './inventory-order-items-table.component.html',
  styles: `
    .cell-quantity {
      width: 100px;
      text-align: right;
      padding-right: 8px;
    }

    .cell-quantity-enabled {
      width: 100px;
      padding: 2px 8px 2px 0;
      vertical-align: middle;
    }
  `,
})
export class InventoryOrderItemsTableComponent implements OnChanges {

  @ViewChild('quantityInput') quantityInput!: InputNumericComponent;

  @Input() orderUID: string = null;

  @Input() items: InventoryOrderItem[] = [];

  @Input() canDelete = false;

  @Input() canEdit = false;

  @Input() displayCountStatus = false;

  @Input() hasCountVariance = false;

  @Input() canEditEntries = false;

  @Input() itemsRequired = false;

  @Input() entriesRequired = false;

  @Output() inventoryOrderItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['number', 'product', 'quantity'];

  dataSource: MatTableDataSource<InventoryOrderItem>;

  editionMode = false;

  rowInEdition: InventoryOrderItem = null;


  constructor(private messageBox: MessageBoxService) { }


  get hasItems(): boolean {
    return this.items.length > 0;
  }


  get isItemInEditionValid(): boolean {
    return this.rowInEdition.quantity !== null && this.rowInEdition.quantity !== undefined &&
           this.rowInEdition.quantity > 0;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.resetEditionMode();
      this.setDataTable();
    }
  }


  isRowInEdition(rowInEditionUID: string): boolean {
    return this.editionMode && rowInEditionUID === this.rowInEdition?.uid;
  }


  onSelectItemClicked(item: InventoryOrderItem) {
    sendEvent(this.inventoryOrderItemsTableEvent, InventoryOrderItemsTableEventType.SELECT_ITEM_CLICKED,
      { item });
  }


  onEditItemClicked(item: InventoryOrderItem) {
    this.rowInEdition = { ...{}, ...item, ...{ quantity: null } };
    this.editionMode = true;
    this.initQuantityInputFocus();
  }


  onCancelEditionClicked() {
    this.resetEditionMode();
  }


  onUpdateItemClicked() {
    const payload = {
      orderUID: this.orderUID,
      itemUID: this.rowInEdition.uid,
      dataFields: this.getDataFields(),
    };

    sendEvent(this.inventoryOrderItemsTableEvent, InventoryOrderItemsTableEventType.UPDATE_ITEM_CLICKED,
      payload);
  }


  onDeleteItemClicked(item: InventoryOrderItem) {
    const message = this.getConfirmDeleteMessage(item);

    this.messageBox.confirm(message, 'Eliminar movimiento', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.inventoryOrderItemsTableEvent,
          InventoryOrderItemsTableEventType.REMOVE_ITEM_CLICKED, {orderUID: this.orderUID, itemUID: item.uid})
      );
  }


  onEditItemEntriesClicked(item: InventoryOrderItem) {
    sendEvent(this.inventoryOrderItemsTableEvent, InventoryOrderItemsTableEventType.EDIT_ITEM_ENTRIES_CLICKED,
      { item })  ;
  }


  onExportReportClicked() {
    sendEvent(this.inventoryOrderItemsTableEvent, InventoryOrderItemsTableEventType.EXPORT_REPORT_CLICKED);
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.items ?? []);
    this.resetColumns();
  }


  private resetColumns() {
    const columns = this.itemsRequired ?
      ['number', 'product', 'location', 'quantity'] :
      ['number', 'product', 'quantity'];

    if (this.entriesRequired) columns.push('assignedQuantity');
    if (this.entriesRequired || this.canEdit || this.canDelete) columns.push('action');

    this.displayedColumns = [...columns];
  }


  private getConfirmDeleteMessage(item: OrderItem): string {
    return `Esta operación eliminará el movimiento:<br><br>
      <table class="confirm-data">
        <tr><td>Producto: </td><td><strong> ${item.productName} </strong></td></tr>
        <tr><td>Cantidad: </td><td><strong> ${item.quantity} </strong></td></tr>
      </table>
     <br>¿Elimino el movimiento?`;
  }


  private resetEditionMode() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  private initQuantityInputFocus() {
    setTimeout(() => this.quantityInput.inputField.nativeElement.focus());
  }


  private getDataFields(): InventoryOrderItemQuantityFields {
    Assertion.assert(this.isItemInEditionValid, 'Programming error: form must be validated before command execution.');

    const data: InventoryOrderItemQuantityFields = {
      quantity: this.rowInEdition.quantity ?? null,
    };

    return data;
  }

}
