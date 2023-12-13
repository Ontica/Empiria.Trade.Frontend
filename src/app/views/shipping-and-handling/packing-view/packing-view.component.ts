/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyPacking, PackingOrderItemField, Packing, PackingItem, PackingItemFields } from '@app/models';

import { PackingOrdersDataService, SalesOrdersDataService } from '@app/data-services';

import { PackingItemsTableEventType } from './packing-items-table.component';

import { PackingItemEditorEventType } from '../packing-items-edition/packing-item-editor.component';

import { PackingItemEntriesEditorEventType } from '../packing-items-edition/packing-item-entries-editor.component';

import { PackingStatusEventType } from './packing-status.component';

export enum PackingViewEventType {
  ORDER_PACKING_UPDATED = 'PackingViewComponent.Event.OrderPackingUpdated',
}

@Component({
  selector: 'emp-trade-packing-view',
  templateUrl: './packing-view.component.html',
})
export class PackingViewComponent implements OnChanges {

  @Input() orderUID: string = '';

  @Input() canPacking: boolean = false;

  @Output() packingViewEvent = new EventEmitter<EventInfo>();

  orderPacking: Packing = EmptyPacking;

  displayPackingItemEditor = false;

  displayPackingItemEntriesEditor = false;

  displayMissingItemsModal = false;

  selectedPackingItem: PackingItem = null;

  submitted = false;

  isLoading = true;

  hasError = false;


  constructor(private packingOrdersData: PackingOrdersDataService,
              private ordersData: SalesOrdersDataService) { }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderUID || changes.canPacking) {
      this.getOrderPacking();
    }
  }


  onPackingStatusEvent(event: EventInfo) {
    switch (event.type as PackingStatusEventType) {

      case PackingStatusEventType.VIEW_STATUS_CLICKED:
        this.displayMissingItemsModal = true;
        return;

      case PackingStatusEventType.SEND_PACKING_CLICKED:
        this.supplyOrder(this.orderUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPackingItemsTableEvent(event: EventInfo) {

    switch (event.type as PackingItemsTableEventType) {

      case PackingItemsTableEventType.CREATE_ITEM_CLICKED:
        // if(this.orderPacking.missingItems.length > 0) {
        this.setDisplayPackingItemEditor(null, true);
        // }
        return;

      case PackingItemsTableEventType.ITEM_CLICKED:
        Assertion.assertValue(event.payload.packingItem, 'event.payload.packingItem');
        if (this.canPacking) {
          this.setDisplayPackingItemEditor(event.payload.packingItem as PackingItem);
        }
        return;

      case PackingItemsTableEventType.ITEM_ENTRIES_CLICKED:
        Assertion.assertValue(event.payload.packingItem, 'event.payload.packingItem');
        this.setDisplayPackingItemEntriesEditor(event.payload.packingItem as PackingItem, true);
        return;

      case PackingItemsTableEventType.DELETE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.packingItem.uid, 'event.payload.packingItem.uid');
        this.deletePackingItem(this.orderUID,
                               event.payload.packingItem.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }


  onPackingItemEditorEvent(event: EventInfo) {

    switch (event.type as PackingItemEditorEventType) {

      case PackingItemEditorEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayPackingItemEditor(null);
        return;

      case PackingItemEditorEventType.CREATE_ENTRY:
        Assertion.assertValue(event.payload.packingItem, 'event.payload.packingItem');
        this.createPackingItem(this.orderUID,
                               event.payload.packingItem as PackingItemFields);
        return

      case PackingItemEditorEventType.UPDATE_ENTRY:
        Assertion.assertValue(event.payload.packingItemUID, 'event.payload.packingItemUID');
        Assertion.assertValue(event.payload.packingItem, 'event.payload.packingItem');
        this.updatePackingItem(this.orderUID,
                               event.payload.packingItemUID,
                               event.payload.packingItem as PackingItemFields);
        return

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }


  onPackingItemEntriesEditorEvent(event: EventInfo) {

    switch (event.type as PackingItemEntriesEditorEventType) {

      case PackingItemEntriesEditorEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayPackingItemEntriesEditor(null, false);
        return;

      case PackingItemEntriesEditorEventType.ASSIGN_ENTRY_ITEM:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        this.assignPackingItemEntry(this.orderUID, this.selectedPackingItem.uid,
          event.payload.entry as PackingOrderItemField);
        return;

      case PackingItemEntriesEditorEventType.REMOVE_ENTRY_ITEM:
        Assertion.assertValue(event.payload.packingOrderItem, 'event.payload.packingOrderItem');
        Assertion.assertValue(event.payload.packingOrderItem.uid, 'event.payload.packingOrderItem.uid');
        this.removePackingItemEntry(this.orderUID, this.selectedPackingItem.uid,
          event.payload.packingOrderItem.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }


  onMissingItemsModalEvent(event: EventInfo) {
    this.displayMissingItemsModal = false;
  }


  private getOrderPacking() {
    this.isLoading = true;
    this.hasError = false;

    this.packingOrdersData.getOrderPacking(this.orderUID)
      .firstValue()
      .then(x => this.orderPacking = x)
      .catch(e => this.catchOrderPackingError())
      .finally(() => this.isLoading = false);
  }


  private catchOrderPackingError() {
    this.hasError = true;
    this.orderPacking = EmptyPacking;
  }


  private createPackingItem(orderUID: string, packingItemFields: PackingItemFields) {
    this.submitted = true;

    this.packingOrdersData.createPackingItem(orderUID, packingItemFields)
      .firstValue()
      .then(x => {
        this.setOrderPackingCloseAndEmit(x);
        this.displayPackingItemEditor = false;
      })
      .finally(() => this.submitted = false);
  }


  private updatePackingItem(orderUID: string, packingItemUID: string, packingItemFields: PackingItemFields) {
    this.submitted = true;

    this.packingOrdersData.updatePackingItem(orderUID, packingItemUID, packingItemFields)
      .firstValue()
      .then(x => this.setOrderPackingCloseAndEmit(x))
      .finally(() => this.submitted = false);
  }


  private deletePackingItem(orderUID: string, packingItemUID: string) {
    this.submitted = true;

    this.packingOrdersData.deletePackingItem(orderUID, packingItemUID)
      .firstValue()
      .then(x => this.setOrderPackingCloseAndEmit(x))
      .finally(() => this.submitted = false);
  }


  private assignPackingItemEntry(orderUID: string, packingItemUID: string, entryFields: PackingOrderItemField) {
    this.submitted = true;

    this.packingOrdersData.createPackingItemEntry(orderUID, packingItemUID, entryFields)
      .firstValue()
      .then(x => this.setOrderPackingAndEmit(x))
      .finally(() => this.submitted = false);
  }


  private removePackingItemEntry(orderUID: string, packingItemUID: string, packingItemEntryUID: string) {
    this.submitted = true;

    this.packingOrdersData.removePackingItemEntry(orderUID, packingItemUID, packingItemEntryUID)
      .firstValue()
      .then(x => this.setOrderPackingAndEmit(x))
      .finally(() => this.submitted = false);
  }


  private supplyOrder(orderUID: string) {
    this.submitted = true;

    this.ordersData.supplyOrder(orderUID)
      .firstValue()
      .then(x => this.emitOrderPackingUpdated())
      .finally(() => this.submitted = false);
  }


  private setOrderPackingAndEmit(ordenPacking: Packing) {
    this.orderPacking = ordenPacking;
    this.refreshPackingItemEntriesEditor();
    this.emitOrderPackingUpdated();
  }


  private setOrderPackingCloseAndEmit(ordenPacking: Packing) {
    this.setOrderPackingAndEmit(ordenPacking);
    this.closeEditors();
  }


  private emitOrderPackingUpdated() {
    sendEvent(this.packingViewEvent, PackingViewEventType.ORDER_PACKING_UPDATED, { orderUID: this.orderUID });
  }


  private closeEditors() {
    this.setDisplayPackingItemEditor(null);
    this.setDisplayPackingItemEntriesEditor(null, false);
  }


  private setDisplayPackingItemEditor(item: PackingItem, display?: boolean) {
    this.selectedPackingItem = item;
    this.displayPackingItemEditor = display ?? this.selectedPackingItem !== null;
  }


  private setDisplayPackingItemEntriesEditor(item: PackingItem, display: boolean) {
    this.selectedPackingItem = item;
    this.displayPackingItemEntriesEditor = display;
  }


  private refreshPackingItemEntriesEditor() {
    if (this.displayPackingItemEntriesEditor) {
      const newSelectedPackingItem =
        this.orderPacking.packagedItems.find(x => x.uid === this.selectedPackingItem.uid);
      this.setDisplayPackingItemEntriesEditor(newSelectedPackingItem, true);
    }
  }

}
