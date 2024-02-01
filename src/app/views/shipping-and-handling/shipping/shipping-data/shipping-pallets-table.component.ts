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

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ShippingPalletWithPackages } from '@app/models';

export enum ShippingPalletsTableEventType {
  ITEM_CLICKED        = 'ShippingPalletsTableComponent.Event.ItemClicked',
  CREATE_ITEM_CLICKED = 'ShippingPalletsTableComponent.Event.CreateItemClicked',
  DELETE_ITEM_CLICKED = 'ShippingPalletsTableComponent.Event.DeleteItemClicked',
}

@Component({
  selector: 'emp-trade-shipping-pallets-table',
  templateUrl: './shipping-pallets-table.component.html',
})
export class ShippingPalletsTableComponent implements OnChanges {

  @Input() shippingPallets: ShippingPalletWithPackages[] = [];

  @Input() canEdit = false;

  @Output() shippingPalletsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['ID', 'palletID', 'totalPackages', 'totalWeight', 'totalVolume'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<ShippingPalletWithPackages>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.shippingPallets) {
      this.dataSource = new MatTableDataSource(this.shippingPallets);
      this.resetColumns();
    }
  }


  get hasShippingPallets(): boolean {
    return this.shippingPallets.length > 0;
  }


  onShippingPalletClicked(pallet: ShippingPalletWithPackages) {
    sendEvent(this.shippingPalletsTableEvent, ShippingPalletsTableEventType.ITEM_CLICKED, { item: pallet });
  }


  onCreateShippingPalletClicked() {
    sendEvent(this.shippingPalletsTableEvent, ShippingPalletsTableEventType.CREATE_ITEM_CLICKED);
  }


  onDeleteShippingPalletClicked(pallet: ShippingPalletWithPackages) {
    this.confirmDeleteShippingPallet(pallet);
  }


  private resetColumns() {
    this.displayedColumns = [];

    if (this.canEdit) {
      this.displayedColumns.push('action');
    }

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];
  }


  private confirmDeleteShippingPallet(pallet: ShippingPalletWithPackages) {
    const message = `Esta operación eliminará la tarima ` +
      `<strong>${pallet.shippingPalletName}</strong><br><br>¿Elimino la tarima?`;

    this.messageBox.confirm(message, 'Eliminar tarima', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.shippingPalletsTableEvent,
            ShippingPalletsTableEventType.DELETE_ITEM_CLICKED, { pallet });
        }
      });
  }
}
