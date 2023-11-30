/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { expandCollapse } from '@app/shared/animations/animations';

import { MissingItem, MissingItemField, WarehouseBin } from '@app/models';

export enum MissingItemLocationEventType {
  ASSIGN_ITEM_CLICKED = 'MissingItemLocationComponent.Event.AssignItemClicked',
}

@Component({
  selector: 'emp-trade-missing-item-location',
  templateUrl: './missing-item-location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [expandCollapse],
})
export class MissingItemLocationComponent implements OnChanges {

  @Input() missingItem: MissingItem;

  @Input() canAdd = false;

  @Output() missingItemLocationEvent = new EventEmitter<EventInfo>();

  warehouseBin: WarehouseBin = null;

  quantity: number = null;


  ngOnChanges() {
    this.setWarehouseBinDefault();
  }


  get quantityHasValue(): boolean {
    return this.quantity !== null && this.quantity !== undefined;
  }


  get isQuantityInvalid(): boolean {
    return this.quantityHasValue &&
      (this.quantity <= 0 || this.quantity > this.warehouseBin.stock || this.quantity > this.missingItem.quantity);
  }


  onAssignItemClicked() {
    if (this.quantityHasValue && !this.isQuantityInvalid) {

      const entry: MissingItemField = {
        orderItemUID: this.missingItem.orderItemUID,
        warehouseBinUID: this.warehouseBin.uid,
        quantity: this.quantity,
      };

      sendEvent(this.missingItemLocationEvent,
        MissingItemLocationEventType.ASSIGN_ITEM_CLICKED, { entry });

      this.quantity = null;
    }
  }


  private setWarehouseBinDefault() {
    this.warehouseBin = ArrayLibrary.getFirstItem(this.missingItem.warehouseBins) ?? null;
  }

}
