/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { InventoryDataService } from '@app/data-services';

import { EmptyOrderItem, OrderHolder, OrderItem, OrderItemEntry } from '@app/models';

import { InventoryOrderItemEntryEditorEventType } from './inventory-order-item-entry-editor.component';

import { InventoryOrderItemEntriesTableEventType } from './inventory-order-item-entries-table.component';


export enum InventoryOrderItemEntriesEditionEventType {
  CLOSE_BUTTON_CLICKED = 'InventoryOrderItemEntriesEditionComponent.Event.CloseButtonClicked',
  ENTRIES_UPDATED      = 'InventoryOrderItemEntriesEditionComponent.Event.EntriesUpdated',
}

@Component({
  selector: 'emp-trade-inventory-order-item-entries-edition',
  templateUrl: './inventory-order-item-entries-edition.component.html',
})
export class InventoryOrderItemEntriesEditionComponent implements OnChanges {

  @Input() orderUID: string = null;

  @Input() assignedQuantity = 0;

  @Input() item: OrderItem = EmptyOrderItem;

  @Input() canEdit = false;

  @Output() inventoryOrderItemEntriesEditionEvent = new EventEmitter<EventInfo>();

  title = 'Editar localizaciones';

  hintText = 'Información de las localizaciones.';

  submitted = false;


  constructor(private inventoryData: InventoryDataService) { }


  ngOnChanges() {
    this.setTexts();
  }


  onCloseButtonClicked() {
    sendEvent(this.inventoryOrderItemEntriesEditionEvent,
      InventoryOrderItemEntriesEditionEventType.CLOSE_BUTTON_CLICKED);
  }


  onInventoryOrderItemEntryEditorEvent(event: EventInfo) {
    switch (event.type as InventoryOrderItemEntryEditorEventType) {
      case InventoryOrderItemEntryEditorEventType.ASSIGN_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.assignOrderItemEntry(event.payload.orderUID,
                                  event.payload.itemUID,
                                  event.payload.dataFields as OrderItemEntry);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrderItemEntriesTableEvent(event: EventInfo) {
    switch (event.type as InventoryOrderItemEntriesTableEventType) {
      case InventoryOrderItemEntriesTableEventType.REMOVE_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        this.removeOrderItemEntry(event.payload.orderUID,
                                  event.payload.itemUID,
                                  event.payload.entryUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private assignOrderItemEntry(orderUID: string, itemUID: string, entry: OrderItemEntry) {
    this.submitted = true;

    this.inventoryData.assignOrderItemEntry(orderUID, itemUID, entry)
      .firstValue()
      .then(x => this.resolveItemEntriesUpdated(x))
      .finally(() => this.submitted = false);
  }


  private removeOrderItemEntry(orderUID: string, itemUID: string, entryUID: string) {
    this.submitted = true;

    this.inventoryData.removeOrderItemEntry(orderUID, itemUID, entryUID)
      .firstValue()
      .then(x => this.resolveItemEntriesUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveItemEntriesUpdated(order: OrderHolder) {
    sendEvent(this.inventoryOrderItemEntriesEditionEvent,
      InventoryOrderItemEntriesEditionEventType.ENTRIES_UPDATED, { order });
  }


  private setTexts() {
    const assignedQuantity = FormatLibrary.numberWithCommas(this.item.assignedQuantity, '1.2-2');
    const quantity = FormatLibrary.numberWithCommas(this.item.quantity, '1.2-2');

    this.title = `Editar localizaciones - Producto: ${this.item.productName}`;
    this.hintText = `${assignedQuantity} de ${quantity} asignados.`
  }

}
