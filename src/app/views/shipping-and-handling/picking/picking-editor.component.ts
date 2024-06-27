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

import { PackingDataService } from '@app/data-services';

import { EmptyPacking, InventoryOrderFields, SaleOrder, SaleOrderItem, Packing } from '@app/models';

import { PackingStatusEventType } from '../packing/packing-view/packing-status.component';

import {
  InventoryOrderHeaderEventType
} from '@app/views/inventory/inventory-order/inventory-order-header.component';


export enum PickingEditorEventType {
  PICKING_UPDATED = 'PickingEditorComponent.Event.PickingUpdated',
}

@Component({
  selector: 'emp-trade-picking-editor',
  templateUrl: './picking-editor.component.html',
})
export class PickingEditorComponent {

  @Input() orderUID: string = '';

  @Input() packing: Packing = EmptyPacking;

  @Input() items: SaleOrderItem[] = [];

  @Input() canEdit: boolean = false;

  @Output() pickingEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private packingData: PackingDataService,
              private messageBox: MessageBoxService) {

  }


  onPackingStatusEvent(event: EventInfo) {
    switch (event.type as PackingStatusEventType) {

      case PackingStatusEventType.VIEW_ITEMS_CLICKED:
        this.messageBox.showInDevelopment('Ver productos', this.items);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InventoryOrderHeaderEventType) {
      case InventoryOrderHeaderEventType.UPDATE_INVENTORY_ORDER:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateOrderPicking(event.payload.dataFields as InventoryOrderFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateOrderPicking(dataFields: InventoryOrderFields) {
    this.submitted = true;

    this.packingData.updateOrderPicking(this.orderUID, dataFields)
      .firstValue()
      .then(x => this.resolveUpdateOrderPicking(x))
      .finally(() => this.submitted = false);
  }


  private resolveUpdateOrderPicking(order: SaleOrder) {
    const payload = { order };
    sendEvent(this.pickingEditorEvent, PickingEditorEventType.PICKING_UPDATED, payload);
  }

}
