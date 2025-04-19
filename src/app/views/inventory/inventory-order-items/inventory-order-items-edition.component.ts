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

import { EmptyOrderItem, InventoryOrder, InventoryOrderItemFields, InventoryProductSelection,
         mapInventoryOrderItemFieldsFromSelection, OrderHolder, OrderItem } from '@app/models';

import { InventoryOrderItemsTableEventType } from './inventory-order-items-table.component';

import {
  InventoryOrderProductSelectorEventType
} from '../inventory-order-product-selector/inventory-order-product-selector.component';

import {
  InventoryOrderItemEntriesEditionEventType
} from '../inventory-order-item-entries/inventory-order-item-entries-edition.component';


export enum InventoryOrderItemsEditionEventType {
  ITEM_CREATED    = 'InventoryOrderItemsEditionComponent.Event.ItemCreated',
  ITEM_DELETED    = 'InventoryOrderItemsEditionComponent.Event.ItemDeleted',
  ENTRIES_UPDATED = 'InventoryOrderItemsEditionComponent.Event.EntriesUpdated',
}

@Component({
  selector: 'emp-trade-inventory-order-items-edition',
  templateUrl: './inventory-order-items-edition.component.html',
})
export class InventoryOrderItemsEditionComponent {

  @Input() orderUID = '';

  @Input() items: OrderItem[] = [];

  @Input() canEditItems = false;

  @Input() canEditEntries = false;

  @Output() inventoryOrderItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayProductSelector = false;

  displayItemEntriesEdition = false;

  selectedItem: OrderItem = EmptyOrderItem;


  constructor(private inventoryData: InventoryDataService,
              private messageBox: MessageBoxService,
              private alertService: AlertService) { }


  onAddItemClicked() {
    this.displayProductSelector = true;
  }


  onCloseEntriesClicked() {
    this.showConfirmCloseEntriesMessage();
  }


  onInventoryOrderProductSelectorEvent(event: EventInfo) {
    switch (event.type as InventoryOrderProductSelectorEventType) {
      case InventoryOrderProductSelectorEventType.CLOSE_MODAL_CLICKED:
        this.displayProductSelector = false;
        return;
      case InventoryOrderProductSelectorEventType.ADD_PRODUCT:
        Assertion.assert(event.payload.selection, 'event.payload.selection');
        Assertion.assert(event.payload.selection.vendor, 'event.payload.selection.vendor');
        Assertion.assert(event.payload.selection.warehouseBin, 'event.payload.selection.warehouseBin');
        Assertion.assert(event.payload.selection.quantity, 'event.payload.selection.quantity');
        const orderItem = mapInventoryOrderItemFieldsFromSelection(
          event.payload.selection as InventoryProductSelection
        );
        this.createOrderItem(orderItem);
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
        this.setSelectedItem(event.payload.item as OrderItem);
        return;
      case InventoryOrderItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        this.deleteOrderItem(event.payload.itemUID);
        return;
      case InventoryOrderItemsTableEventType.EDIT_ITEM_ENTRIES_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.setSelectedItem(event.payload.item as OrderItem);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrderItemEntriesEditionEvent(event: EventInfo) {
    switch (event.type as InventoryOrderItemEntriesEditionEventType) {
      case InventoryOrderItemEntriesEditionEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedItem(EmptyOrderItem);
        return;
      case InventoryOrderItemEntriesEditionEventType.ENTRIES_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.resolveOrderItemEntriesUpdated(event.payload.order as OrderHolder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createOrderItem(item: InventoryOrderItemFields) {
    this.submitted = true;

    this.inventoryData.createOrderItem(this.orderUID, item)
      .firstValue()
      .then(x => this.resolveOrderItemUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteOrderItem(itemUID: string) {
    this.submitted = true;

    this.inventoryData.deleteOrderItem(this.orderUID, itemUID)
      .firstValue()
      .then(x => this.resolveDeleteOrderItem(x))
      .finally(() => this.submitted = false);
  }


  private closeOrderEntries() {
    this.submitted = true;

    this.inventoryData.closeOrderEntries(this.orderUID)
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
      .then(x => {
        if (x) {
          this.closeOrderEntries();
        }
      });
  }


  private resolveOrderItemUpdated(order: InventoryOrder) {
    this.alertService.openAlert('Se agregó el producto a la orden de inventario.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ITEM_CREATED, { order });
  }


  private resolveDeleteOrderItem(order: InventoryOrder) {
    this.alertService.openAlert('Se eliminó el producto a la orden de inventario.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ITEM_DELETED, { order });
  }


  private resolveOrderItemEntriesUpdated(order: OrderHolder) {
    this.alertService.openAlert('Se actualizaron las ubicaciones del producto.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ENTRIES_UPDATED, { order });

    const selectedItemUpdated = order.items.find(x => x.uid === this.selectedItem.uid);
    this.setSelectedItem(isEmpty(selectedItemUpdated) ? EmptyOrderItem : selectedItemUpdated);
  }


  private resolveCloseOrderItemEntries(order: OrderHolder) {
    this.alertService.openAlert('Se cerró el inventario.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ENTRIES_UPDATED, { order });
  }


  private setSelectedItem(item: OrderItem) {
    this.selectedItem = item;
    this.displayItemEntriesEdition = !isEmpty(this.selectedItem);
  }

}
