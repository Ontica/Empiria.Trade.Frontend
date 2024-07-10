/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { PurchasesDataService } from '@app/data-services';

import { EmptyPurchaseOrderTotals, mapPurchaseOrderItemFieldsFromSelection, PurchaseOrderItem,
         PurchaseOrderItemFields, PurchaseOrderTotals, PurchaseProductSelection } from '@app/models';

import { PurchaseOrderItemsTableEventType } from './purchase-order-items-table.component';

import {
  PurchaseOrderProductSelectorEventType
} from '../purchase-order-product-selector/purchase-order-product-selector.component';


export enum PurchaseOrderItemsEditionEventType {
  ITEM_CREATED = 'PurchaseOrderItemsEditionComponent.Event.ItemCreated',
  ITEM_UPDATED = 'PurchaseOrderItemsEditionComponent.Event.ItemDeleted',
  ITEM_DELETED = 'PurchaseOrderItemsEditionComponent.Event.ItemDeleted',
}

@Component({
  selector: 'emp-trade-purchase-order-items-edition',
  templateUrl: './purchase-order-items-edition.component.html',
})
export class PurchaseOrderItemsEditionComponent {

  @Input() orderUID = '';

  @Input() orderItems: PurchaseOrderItem[] = [];

  @Input() orderTotals: PurchaseOrderTotals = EmptyPurchaseOrderTotals;

  @Input() canEdit = false;

  @Output() purchaseOrderItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayProductSelector = false;


  constructor(private purchasesData: PurchasesDataService,
              private messageBox: MessageBoxService) {

  }


  onImportItemsClicked() {
    this.messageBox.showInDevelopment('Importar productos');
  }


  onAddItemClicked() {
    this.displayProductSelector = true;
  }


  onPurchaseOrderProductSelectorEvent(event: EventInfo) {
    switch (event.type as PurchaseOrderProductSelectorEventType) {
      case PurchaseOrderProductSelectorEventType.CLOSE_MODAL_CLICKED:
        this.displayProductSelector = false;
        return;
      case PurchaseOrderProductSelectorEventType.ADD_PRODUCT:
        Assertion.assert(event.payload.selection, 'event.payload.selection');
        Assertion.assert(event.payload.selection.vendor, 'event.payload.selection.vendor');
        Assertion.assert(event.payload.selection.quantity, 'event.payload.selection.quantity');
        const dataFields = mapPurchaseOrderItemFieldsFromSelection(
          event.payload.selection as PurchaseProductSelection
        );
        this.createOrderItem(dataFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPurchaseOrderItemsTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as PurchaseOrderItemsTableEventType) {
      case PurchaseOrderItemsTableEventType.UPDATE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.orderItemUID, 'event.payload.orderItemUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateOrderItem(event.payload.orderItemUID, event.payload.dataFields as PurchaseOrderItemFields);
        return;

      case PurchaseOrderItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.orderItemUID, 'event.payload.orderItemUID');
        this.deleteOrderItem(event.payload.orderItemUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createOrderItem(dataFields: PurchaseOrderItemFields) {
    this.submitted = true;

    this.purchasesData.createOrderItem(this.orderUID, dataFields)
      .firstValue()
      .then(x =>
        sendEvent(this.purchaseOrderItemsEditionEvent,
          PurchaseOrderItemsEditionEventType.ITEM_CREATED, { order: x })
      )
      .finally(() => this.submitted = false);
  }


  private updateOrderItem(orderItemUID: string, dataFields: PurchaseOrderItemFields) {
    this.submitted = true;

    this.purchasesData.updateOrderItem(this.orderUID, orderItemUID, dataFields)
      .firstValue()
      .then(x =>
        sendEvent(this.purchaseOrderItemsEditionEvent,
          PurchaseOrderItemsEditionEventType.ITEM_UPDATED, { order: x })
      )
      .finally(() => this.submitted = false);
  }


  private deleteOrderItem(orderItemUID: string) {
    this.submitted = true;

    this.purchasesData.deleteOrderItem(this.orderUID, orderItemUID)
      .firstValue()
      .then(x =>
        sendEvent(this.purchaseOrderItemsEditionEvent,
          PurchaseOrderItemsEditionEventType.ITEM_DELETED, { order: x })
      )
      .finally(() => this.submitted = false);
  }

}
