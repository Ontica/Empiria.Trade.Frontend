/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { AlertService } from '@app/shared/containers/alert/alert.service';

import { InventoryOrdersDataService } from '@app/data-services';

import { InventoryOrder, InventoryOrderItem, InventoryOrderItemFields, InventoryProductSelection,
         mapInventoryOrderItemFieldsFromSelection } from '@app/models';

import { InventoryOrderItemsTableEventType } from './inventory-order-items-table.component';

import {
  ProductsLocationSelectorEventType
} from '@app/views/products/products-location-selector/products-location-selector.component';


export enum InventoryOrderItemsEditionEventType {
  ITEM_CREATED = 'InventoryOrderItemsEditionComponent.Event.ItemCreated',
  ITEM_DELETED = 'InventoryOrderItemsEditionComponent.Event.ItemDeleted',
}

@Component({
  selector: 'emp-trade-inventory-order-items-edition',
  templateUrl: './inventory-order-items-edition.component.html',
})
export class InventoryOrderItemsEditionComponent {

  @Input() inventoryOrderUID = '';

  @Input() inventoryOrderItems: InventoryOrderItem[] = [];

  @Output() inventoryOrderItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayProductLocationSelector = false;


  constructor(private inventoryOrdersData: InventoryOrdersDataService,
              private alertService: AlertService) {

  }


  onAddItemClicked() {
    this.displayProductLocationSelector = true;
  }


  onProductsLocationSelectorEvent(event: EventInfo) {
    switch (event.type as ProductsLocationSelectorEventType) {

      case ProductsLocationSelectorEventType.CLOSE_MODAL_CLICKED:
        this.displayProductLocationSelector = false;
        return;

      case ProductsLocationSelectorEventType.ADD_PRODUCT:
        Assertion.assert(event.payload.selection, 'event.payload.selection');
        Assertion.assert(event.payload.selection.vendor, 'event.payload.selection.vendor');
        Assertion.assert(event.payload.selection.warehouseBin, 'event.payload.selection.warehouseBin');
        Assertion.assert(event.payload.selection.position, 'event.payload.selection.position');
        Assertion.assert(event.payload.selection.level, 'event.payload.selection.level');
        Assertion.assert(event.payload.selection.quantity, 'event.payload.selection.quantity');

        const inventoryOrderItem = mapInventoryOrderItemFieldsFromSelection(
          event.payload.selection as InventoryProductSelection
        );

        this.createInventoryOrderItem(inventoryOrderItem);
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
        Assertion.assertValue(event.payload.inventoryOrderItemUID, 'event.payload.inventoryOrderItemUID');
        this.deleteInventoryOrderItem(event.payload.inventoryOrderItemUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createInventoryOrderItem(item: InventoryOrderItemFields) {
    this.submitted = true;

    this.inventoryOrdersData.createInventoryOrderItem(this.inventoryOrderUID, item)
      .firstValue()
      .then(x => this.resolveCreateInventoryOrderItem(x))
      .finally(() => this.submitted = false);
  }


  private deleteInventoryOrderItem(inventoryOrderItemUID: string) {
    this.submitted = true;

    this.inventoryOrdersData.deleteInventoryOrderItem(this.inventoryOrderUID, inventoryOrderItemUID)
      .firstValue()
      .then(x => this.resolveDeleteInventoryOrderItem(x))
      .finally(() => this.submitted = false);
  }


  private resolveCreateInventoryOrderItem(inventoryOrder: InventoryOrder) {
    this.alertService.openAlert('Se agregó el producto a la orden de inventario.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ITEM_CREATED, { inventoryOrder });
  }


  private resolveDeleteInventoryOrderItem(inventoryOrder: InventoryOrder) {
    this.alertService.openAlert('Se eliminó el producto a la orden de inventario.');

    sendEvent(this.inventoryOrderItemsEditionEvent,
      InventoryOrderItemsEditionEventType.ITEM_DELETED, { inventoryOrder });
  }

}
