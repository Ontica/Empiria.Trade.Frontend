/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { PackingItem } from '@app/models';

export enum PackingItemsTableEventType {
  ITEM_CLICKED         = 'PackingItemsTableComponent.Event.ItemClicked',
  CREATE_ITEM_CLICKED  = 'PackingItemsTableComponent.Event.CreateItemClicked',
  DELETE_ITEM_CLICKED  = 'PackingItemsTableComponent.Event.DeleteItemClicked',
  ITEM_ENTRIES_CLICKED = 'PackingItemsTableComponent.Event.ItemEntriesClicked',
}

@Component({
  selector: 'emp-trade-packing-items-table',
  templateUrl: './packing-items-table.component.html',
})
export class PackingItemsTableComponent implements OnChanges {

  @Input() packingItems: PackingItem[] = [];

  @Input() selected: PackingItem = null;

  @Input() canEdit = true;

  @Output() packingItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['packageID', 'size', 'items'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<PackingItem>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.packingItems) {
      this.dataSource = new MatTableDataSource(this.packingItems);
      this.resetColumns();
    }
  }


  get hasPackingItems(): boolean {
    return this.packingItems.length > 0;
  }


  onPackingItemClicked(packingItem: PackingItem) {
    sendEvent(this.packingItemsTableEvent, PackingItemsTableEventType.ITEM_CLICKED, { packingItem });
  }


  onCreatePackingItemClicked() {
    sendEvent(this.packingItemsTableEvent, PackingItemsTableEventType.CREATE_ITEM_CLICKED);
  }


  onPackingItemEntriesClicked(packingItem: PackingItem) {
    sendEvent(this.packingItemsTableEvent, PackingItemsTableEventType.ITEM_ENTRIES_CLICKED, { packingItem });
  }


  onDeletePackingItemClicked(packingItem: PackingItem) {
    this.confirmDeletePackingItem(packingItem);
  }


  private resetColumns() {
    this.displayedColumns = [];

    if (this.canEdit) {
      this.displayedColumns.push('action');
    }

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];
  }


  private confirmDeletePackingItem(packingItem: PackingItem) {
    const message = `Esta operación eliminara el paquete ` +
      `<strong>${packingItem.packageID} - ${packingItem.packageTypeName}</strong><br><br>¿Elimino el paquete?`;

    this.messageBox.confirm(message, 'Eliminar paquete', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.packingItemsTableEvent,
            PackingItemsTableEventType.DELETE_ITEM_CLICKED, { packingItem });
        }
      });
  }

}
