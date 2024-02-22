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

import { EmptyPackagingTotals, PackagingTotals, ShippingPalletWithPackages } from '@app/models';

export enum ShippingPalletsTableEventType {
  UPDATE_PALLET_CLICKED = 'ShippingPalletsTableComponent.Event.UpdatePalletClicked',
  CREATE_PALLET_CLICKED = 'ShippingPalletsTableComponent.Event.CreatePalletClicked',
  DELETE_PALLET_CLICKED = 'ShippingPalletsTableComponent.Event.DeletePalletClicked',
}

@Component({
  selector: 'emp-trade-shipping-pallets-table',
  templateUrl: './shipping-pallets-table.component.html',
})
export class ShippingPalletsTableComponent implements OnChanges {

  @Input() shippingUID: string = '';

  @Input() totalPackages: number = 0;

  @Input() shippingPallets: ShippingPalletWithPackages[] = [];

  @Input() canEdit = false;

  @Output() shippingPalletsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['ID', 'palletID', 'totalPackages', 'totalWeight', 'totalVolume'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<ShippingPalletWithPackages>;

  palletsTotals: PackagingTotals = {...{}, ...EmptyPackagingTotals};

  missingPackages: number = 0;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.shippingPallets) {
      this.dataSource = new MatTableDataSource(this.shippingPallets);
      this.resetColumns();
      this.setPalletsTotals();
    }
  }


  get hasShippingPallets(): boolean {
    return this.shippingPallets.length > 0;
  }


  onShippingPalletClicked(pallet: ShippingPalletWithPackages) {
    sendEvent(this.shippingPalletsTableEvent, ShippingPalletsTableEventType.UPDATE_PALLET_CLICKED,
      { item: pallet });
  }


  onCreateShippingPalletClicked() {
    sendEvent(this.shippingPalletsTableEvent, ShippingPalletsTableEventType.CREATE_PALLET_CLICKED);
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


  private setPalletsTotals() {
    this.palletsTotals.totalPackages = this.shippingPallets.reduce((acum, value) => acum + value.totalPackages, 0);
    this.palletsTotals.totalWeight = this.shippingPallets.reduce((acum, value) => acum + value.totalWeight, 0);
    this.palletsTotals.totalVolume = this.shippingPallets.reduce((acum, value) => acum + value.totalVolume, 0);

    this.missingPackages = this.totalPackages - this.palletsTotals.totalPackages;
  }


  private confirmDeleteShippingPallet(pallet: ShippingPalletWithPackages) {
    const message = `Esta operación eliminará la tarima ` +
      `<strong>${pallet.shippingPalletName}</strong><br><br>¿Elimino la tarima?`;

    this.messageBox.confirm(message, 'Eliminar tarima', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.shippingPalletsTableEvent, ShippingPalletsTableEventType.DELETE_PALLET_CLICKED,
            { shippingPalletUID: pallet.shippingPalletUID });
        }
      });
  }
}
