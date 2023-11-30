/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MissingItem, PackingItem } from '@app/models';

import { PackingItemEntriesTableEventType } from './packing-item-entries-table.component';

import { MissingItemsTableEventType } from './missing-items-table.component';


export enum PackingItemEntriesEditorEventType {
  CLOSE_MODAL_CLICKED = 'PackingItemEntriesEditorComponent.Event.CloseEditorClicked',
  ASSIGN_ENTRY_ITEM   = 'PackingItemEntriesEditorComponent.Event.AssignEntryItem',
  REMOVE_ENTRY_ITEM   = 'PackingItemEntriesEditorComponent.Event.RemoveEntryItem',
}

@Component({
  selector: 'emp-trade-packing-item-entries-editor',
  templateUrl: './packing-item-entries-editor.component.html',
})
export class PackingItemEntriesEditorComponent {

  @Input() packingItem: PackingItem = null;

  @Input() missingItems: MissingItem[] = [];

  @Input() canEdit = true;

  @Output() packingItemEntriesEditorEvent = new EventEmitter<EventInfo>();



  onClose() {
    sendEvent(this.packingItemEntriesEditorEvent, PackingItemEntriesEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onPackingItemEntriesTableEvent(event: EventInfo) {
    switch (event.type as PackingItemEntriesTableEventType) {

      case PackingItemEntriesTableEventType.REMOVE_ENTRY_CLICKED:
        sendEvent(this.packingItemEntriesEditorEvent,
          PackingItemEntriesEditorEventType.REMOVE_ENTRY_ITEM, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onMissingItemsTableEvent(event: EventInfo) {
    switch (event.type as MissingItemsTableEventType) {

      case MissingItemsTableEventType.ASSIGN_ITEM_CLICKED:
        sendEvent(this.packingItemEntriesEditorEvent,
          PackingItemEntriesEditorEventType.ASSIGN_ENTRY_ITEM, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
