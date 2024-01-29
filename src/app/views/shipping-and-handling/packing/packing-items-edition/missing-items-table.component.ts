/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Assertion, EventInfo } from '@app/core';

import { MissingItem } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { GalleryImage } from '@app/shared/components/gallery/gallery.component';

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

  displayedColumns: string[] = ['image', 'product', 'attributes', 'quantity', 'selection'];

  dataSource: MatTableDataSource<MissingItem>;

  imageSelected: GalleryImage = null;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.missingItems) {
      this.dataSource = new MatTableDataSource(this.missingItems);
    }
  }


  get hasItems(): boolean {
    return this.missingItems.length > 0;
  }


  onProductImageClicked(event) {
    Assertion.assert(event.imageUrl, 'event.imageUrl');
    Assertion.assert(event.imageName, 'event.imageName');

    this.imageSelected = {
      url: event.imageUrl,
      name: event.imageName,
    };
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
