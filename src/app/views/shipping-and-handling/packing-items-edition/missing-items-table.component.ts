/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MissingItem } from '@app/models';

import { MissingItemLocationEventType } from './missing-item-location.component';

export enum MissingItemsTableEventType {
  ASSIGN_ITEM_CLICKED = 'MissingItemsTableComponent.Event.AssignItemClicked',
}

@Component({
  selector: 'emp-trade-missing-items-table',
  templateUrl: './missing-items-table.component.html',
})
export class MissingItemsTableComponent implements OnChanges {

  @Input() missingItems: MissingItem[] = [];

  @Input() canAssign = false;

  @Output() missingItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['product', 'attributes', 'quantity', 'selection'];

  dataSource: MatTableDataSource<MissingItem>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.missingItems) {
      this.dataSource = new MatTableDataSource(this.missingItems);
    }
  }


  get hasItems(): boolean {
    return this.missingItems.length > 0;
  }


  onMissingItemLocationEvent(event: EventInfo) {

    switch (event.type as MissingItemLocationEventType) {

      case MissingItemLocationEventType.ASSIGN_ITEM_CLICKED:
        sendEvent(this.missingItemsTableEvent, MissingItemsTableEventType.ASSIGN_ITEM_CLICKED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }

}
