/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { AlertService } from '@app/shared/services';

import { InventoryDataService } from '@app/data-services';

import { InventoryOrder, InventoryOrderItem, InventoryOrderItemFields, InventoryProductSelection,
         mapInventoryOrderItemFieldsFromSelection } from '@app/models';

import { InventoryOrderItemsTableEventType } from './inventory-order-items-table.component';

import {
  InventoryOrderProductSelectorEventType
} from '../inventory-order-product-selector/inventory-order-product-selector.component';


export enum InventoryOrderItemsEditionEventType {
  ITEM_CREATED = 'InventoryOrderItemsEditionComponent.Event.ItemCreated',
  ITEM_DELETED = 'InventoryOrderItemsEditionComponent.Event.ItemDeleted',
}

@Component({
  selector: 'emp-trade-inventory-order-items-edition',
  templateUrl: './inventory-order-items-edition.component.html',
})
export class InventoryOrderItemsEditionComponent {

  @Input() orderUID = '';

  @Input() orderItems: InventoryOrderItem[] = [];

  @Input() canEdit = false;

  @Output() inventoryOrderItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayProductSelector = false;


  constructor(private inventoryData: InventoryDataService,
              private alertService: AlertService) {

  }


  onAddItemClicked() {
    this.displayProductSelector = true;
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
    if (this.submitted) {
      return;
    }

    switch (event.type as InventoryOrderItemsTableEventType) {
      case InventoryOrderItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.orderItemUID, 'event.payload.orderItemUID');
        this.deleteOrderItem(event.payload.orderItemUID);
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
      .then(x => this.resolveCreateOrderItem(x))
      .finally(() => this.submitted = false);
  }


  private deleteOrderItem(orderItemUID: string) {
    this.submitted = true;

    this.inventoryData.deleteOrderItem(this.orderUID, orderItemUID)
      .firstValue()
      .then(x => this.resolveDeleteOrderItem(x))
      .finally(() => this.submitted = false);
  }


  private resolveCreateOrderItem(order: InventoryOrder) {
    this.alertService.openAlert('Se agregó el producto a la orden de inventario.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ITEM_CREATED, { order });
  }


  private resolveDeleteOrderItem(order: InventoryOrder) {
    this.alertService.openAlert('Se eliminó el producto a la orden de inventario.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ITEM_DELETED, { order });
  }

}
