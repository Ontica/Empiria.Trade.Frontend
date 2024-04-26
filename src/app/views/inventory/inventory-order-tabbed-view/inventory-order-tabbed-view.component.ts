/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyInventoryOrder, InventoryOrder } from '@app/models';


export enum InventoryOrderTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'InventoryOrderTabbedViewComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-trade-inventory-order-tabbed-view',
  templateUrl: './inventory-order-tabbed-view.component.html',
})
export class InventoryOrderTabbedViewComponent implements OnChanges {

  @Input() inventoryOrder: InventoryOrder = EmptyInventoryOrder;

  @Output() inventoryOrderTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    sendEvent(this.inventoryOrderTabbedViewEvent, InventoryOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  private setTitle() {
    const postingTime = DateStringLibrary.format(this.inventoryOrder.postingTime);

    this.title = `${this.inventoryOrder.inventoryOrderNo}` +
      `<span class="tag tag-small">${this.inventoryOrder.status}</span>`;

    this.hint = `<strong>${this.inventoryOrder.inventoryOrderType.name} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${postingTime}`;
  }

}
