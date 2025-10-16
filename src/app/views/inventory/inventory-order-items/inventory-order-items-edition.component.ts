/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { AlertService, MessageBoxService } from '@app/shared/services';

import { InventoryDataService } from '@app/data-services';

import { EmptyInventoryOrderItem, InventoryOrderHolder, InventoryOrderItem, InventoryOrderItemFields,
         InventoryOrderItemQuantityFields } from '@app/models';

import { InventoryOrderItemsTableEventType } from './inventory-order-items-table.component';

import { InventoryOrderItemEditorEventType } from './inventory-order-item-editor.component';

import {
  InventoryOrderItemEntriesEditionEventType
} from '../inventory-order-item-entries/inventory-order-item-entries-edition.component';


export enum InventoryOrderItemsEditionEventType {
  ITEM_UPDATED    = 'InventoryOrderItemsEditionComponent.Event.ItemsUpdated',
  ENTRIES_UPDATED = 'InventoryOrderItemsEditionComponent.Event.EntriesUpdated',
}

@Component({
  selector: 'emp-trade-inventory-order-items-edition',
  templateUrl: './inventory-order-items-edition.component.html',
})
export class InventoryOrderItemsEditionComponent {

  @Input() orderUID = '';

  @Input() items: InventoryOrderItem[] = [];

  @Input() canEditItems = false;

  @Input() canEditEntries = false;

  @Input() itemsRequired = false;

  @Input() entriesRequired = false;

  @Output() inventoryOrderItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayItemEditor = false;

  displayItemEntriesEdition = false;

  selectedItem: InventoryOrderItem = EmptyInventoryOrderItem;


  constructor(private inventoryData: InventoryDataService,
              private messageBox: MessageBoxService,
              private alertService: AlertService) { }


  onCreateItemClicked() {
    this.displayItemEditor = true;
  }


  onCloseEntriesClicked() {
    this.showConfirmCloseEntriesMessage();
  }


  onInventoryOrderItemEditorEvent(event: EventInfo) {
    switch (event.type as InventoryOrderItemEditorEventType) {
      case InventoryOrderItemEditorEventType.CLOSE_BUTTON_CLICKED:
        this.displayItemEditor = false;
        return;
      case InventoryOrderItemEditorEventType.ADD_BUTTON_CLICKED:
        Assertion.assert(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assert(event.payload.dataFields, 'event.payload.dataFields');
        this.createOrderItem(event.payload.orderUID, event.payload.dataFields as InventoryOrderItemFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrderItemsTableEvent(event: EventInfo) {
    switch (event.type as InventoryOrderItemsTableEventType) {
      case InventoryOrderItemsTableEventType.SELECT_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.setSelectedItem(event.payload.item as InventoryOrderItem);
        return;
      case InventoryOrderItemsTableEventType.UPDATE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateOrderItemQuantity(event.payload.orderUID, event.payload.itemUID,
                                     event.payload.dataFields as InventoryOrderItemQuantityFields);
        return;
      case InventoryOrderItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        this.deleteOrderItem(event.payload.orderUID, event.payload.itemUID);
        return;
      case InventoryOrderItemsTableEventType.EDIT_ITEM_ENTRIES_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.setSelectedItem(event.payload.item as InventoryOrderItem);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrderItemEntriesEditionEvent(event: EventInfo) {
    switch (event.type as InventoryOrderItemEntriesEditionEventType) {
      case InventoryOrderItemEntriesEditionEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedItem(EmptyInventoryOrderItem);
        return;
      case InventoryOrderItemEntriesEditionEventType.ENTRIES_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.resolveOrderItemEntriesUpdated(event.payload.data as InventoryOrderHolder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createOrderItem(orderUID: string, dataFields: InventoryOrderItemFields) {
    this.submitted = true;

    this.inventoryData.createOrderItem(orderUID, dataFields)
      .firstValue()
      .then(x => this.resolveOrderItemCreated(x))
      .finally(() => this.submitted = false);
  }


  private updateOrderItemQuantity(orderUID: string, itemUID: string, dataFields: InventoryOrderItemQuantityFields) {
    this.submitted = true;

    this.inventoryData.updateOrderItemQuantity(orderUID, itemUID, dataFields)
      .firstValue()
      .then(x => this.resolveOrderItemUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteOrderItem(orderUID: string, itemUID: string) {
    this.submitted = true;

    this.inventoryData.deleteOrderItem(orderUID, itemUID)
      .firstValue()
      .then(x => this.resolveOrderItemDeleted(x))
      .finally(() => this.submitted = false);
  }


  private closeOrderEntries(orderUID: string) {
    this.submitted = true;

    this.inventoryData.closeOrderEntries(orderUID)
      .firstValue()
      .then(x => this.resolveCloseOrderItemEntries(x))
      .finally(() => this.submitted = false);
  }


  private showConfirmCloseEntriesMessage() {
    const title = 'Cerrar asignación de productos';
    const message = `Esta operación cerrará el proceso de asignación de localizaciones para los productos de esta orden.
      <br><br>¿Cierro la asignación?`;

    this.messageBox.confirm(message, title)
      .firstValue()
      .then(x => x ? this.closeOrderEntries(this.orderUID) : null);
  }


  private resolveOrderItemCreated(data: InventoryOrderHolder) {
    this.alertService.openAlert('Se agregó el producto a la orden de inventario.');
    this.emitItemsUpdated(data);
  }


  private resolveOrderItemUpdated(data: InventoryOrderHolder) {
    this.alertService.openAlert('Se actualizo la cantidad de producto.');
    this.emitItemsUpdated(data);
  }


  private resolveOrderItemDeleted(data: InventoryOrderHolder) {
    this.alertService.openAlert('Se eliminó el producto de la orden de inventario.');
    this.emitItemsUpdated(data);
  }


  private emitItemsUpdated(data: InventoryOrderHolder) {
    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ITEM_UPDATED, { data });
  }


  private resolveOrderItemEntriesUpdated(data: InventoryOrderHolder) {
    this.alertService.openAlert('Se actualizaron las ubicaciones del producto.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ENTRIES_UPDATED, { data });

    const selectedItemUpdated = data.items.find(x => x.uid === this.selectedItem.uid);
    this.setSelectedItem(isEmpty(selectedItemUpdated) ? EmptyInventoryOrderItem : selectedItemUpdated);
  }


  private resolveCloseOrderItemEntries(data: InventoryOrderHolder) {
    this.alertService.openAlert('Se cerró el inventario.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ENTRIES_UPDATED, { data });
  }


  private setSelectedItem(item: InventoryOrderItem) {
    this.selectedItem = item;
    this.displayItemEntriesEdition = !isEmpty(this.selectedItem);
  }

}
