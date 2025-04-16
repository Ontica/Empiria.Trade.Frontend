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

import { MessageBoxService } from '@app/shared/services';

import { PackingItem, PackingOrderItem } from '@app/models';


export enum PackingItemEntriesTableEventType {
  REMOVE_ENTRY_CLICKED = 'PackingItemEntriesTableComponent.Event.RemoveEntryClicked',
}

@Component({
  selector: 'emp-trade-packing-item-entries-table',
  templateUrl: './packing-item-entries-table.component.html',
})
export class PackingItemEntriesTableComponent implements OnChanges {

  @Input() packingItem: PackingItem = null;

  @Input() canEdit = true;

  @Output() packingItemEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['quantity', 'product', 'description', 'warehouseBin'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<PackingOrderItem>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.packingItem) {
      this.dataSource = new MatTableDataSource(this.packingItem.orderItems);
      this.resetColumns();
    }
  }


  get hasOrderItems(): boolean {
    return this.packingItem.orderItems.length > 0;
  }


  onRemoveEntryClicked(packingOrderItem: PackingOrderItem) {
    this.confirmRemoveOrderItem(packingOrderItem);
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('action');
    }
  }


  private confirmRemoveOrderItem(packingOrderItem: PackingOrderItem) {
    const message = `Esta operación eliminará el producto ` +
      `<strong>${packingOrderItem.product.productCode} - ${packingOrderItem.presentation.description}</strong> ` +
      `del paquete<br><br>¿Elimino el producto?`;

    this.messageBox.confirm(message, 'Eliminar producto', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.packingItemEntriesTableEvent, PackingItemEntriesTableEventType.REMOVE_ENTRY_CLICKED,
            { packingOrderItem })
        }
      });
  }

}
