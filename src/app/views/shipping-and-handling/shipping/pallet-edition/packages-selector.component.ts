/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { EmptyShipping, EmptyShippingPalletWithPackages, EmptyPackagingTotals, OrderForShipping, OrderPackage,
         Shipping, ShippingPalletWithPackages, PackagingTotals } from '@app/models';

import { EventInfo } from '@app/core';


interface PalletOrderSelection {
  order: OrderForShipping;
  packages: string[];
  disabled: string[];
  expanded: boolean;
  selection: SelectionModel<string>;
  totals: PackagingTotals;
}

export enum PackagesSelectorEventType {
  SELECTION_CHANGES = 'PackagesSelectorComponent.Event.SelectionChanges',
}

@Component({
  selector: 'emp-trade-packages-selector',
  templateUrl: './packages-selector.component.html',
})
export class PackagesSelectorComponent implements OnInit {

  @Input() shipping: Shipping = EmptyShipping;

  @Input() pallet: ShippingPalletWithPackages = EmptyShippingPalletWithPackages;

  @Output() packagesSelectorEvent = new EventEmitter<EventInfo>();

  palletOrdersSelection: PalletOrderSelection[] = [];

  packagesDisabled: string[] = [];

  packagesTotal: PackagingTotals = EmptyPackagingTotals;


  ngOnInit() {
    this.setInitData();
    this.emitPalletOrderSelection();
  }


  onToggleExpandAllOrders(expanded: boolean) {
    this.palletOrdersSelection.forEach(x => x.expanded = expanded);
  }


  onToggleSelectAllOrders(select: boolean) {
    this.palletOrdersSelection.forEach(x => {
      if (select) {
        x.selection.select(...x.packages);
        x.selection.deselect(...this.packagesDisabled);
      } else {
        x.selection.clear();
      }
    });

    this.recalculateOrderTotals();
    this.recalculateTotals();
    this.emitPalletOrderSelection();
  }


  onSelectAllPackagesFromOrder(order: PalletOrderSelection, selection) {
    selection.deselect(...this.packagesDisabled);
    order.selection = selection;

    this.recalculateOrderTotals();
    this.recalculateTotals();
    this.emitPalletOrderSelection();
  }


  onSelectPackageToOrder(order: PalletOrderSelection, packageItem: OrderPackage) {
    order.selection.toggle(packageItem.packingItemUID);
    this.recalculateOrderTotals();
    this.recalculateTotals();
    this.emitPalletOrderSelection();
  }


  private setInitData() {
    this.setPalletOrdersSelectionOrdered();
    this.setPackagesDisabled();
    this.setPackagesSelected();
    this.recalculateOrderTotals();
    this.recalculateTotals();
  }


  private setPalletOrdersSelectionOrdered() {
    this.palletOrdersSelection = ArrayLibrary.sortByArrayKeyLenght(
      this.shipping.ordersForShipping.map(x => this.getPalletOrderSelection(x)),
      'packages'
    );
  }


  private setPackagesDisabled() {
    if (this.shipping.shippingPalletsWithPackages) {
      this.shipping.shippingPalletsWithPackages
        .filter(x => x.shippingPalletUID !== this.pallet.shippingPalletUID)
        .forEach(x => this.packagesDisabled = [...this.packagesDisabled, ...x.packages]);
    }
  }


  private setPackagesSelected() {
    this.palletOrdersSelection.forEach(order => {
      const packagesInOrderToSelect = this.pallet.packages.filter(x => order.packages.includes(x));
      order.selection.select(...packagesInOrderToSelect);
    });
  }


  private recalculateOrderTotals() {
    this.palletOrdersSelection.forEach(order => {
      const packages = this.shipping.ordersForShipping.find(x => x.orderUID === order.order.orderUID).packages
        .filter(x => order.selection.selected.includes(x.packingItemUID));

      order.totals = {
        totalPackages: packages.length,
        totalWeight: packages.reduce((acum, value) => acum + value.totalWeight, 0),
        totalVolume: packages.reduce((acum, value) => acum + value.totalVolume, 0),
      };
    });
  }


  private recalculateTotals() {
    setTimeout(() => {
      let selected = [];
      this.palletOrdersSelection.forEach(item => selected = [...selected, ...item.selection.selected]);

      let packages = [];
      this.shipping.ordersForShipping.forEach(item => packages = [...packages, ...item.packages]);
      const packagesSelected = packages.filter(x => selected.includes(x.packingItemUID));

      this.packagesTotal.totalPackages = packagesSelected.length;
      this.packagesTotal.totalWeight = packagesSelected.reduce((acum, value) => acum + value.totalWeight, 0);
      this.packagesTotal.totalVolume = packagesSelected.reduce((acum, value) => acum + value.totalVolume, 0);
    });
  }


  private getPalletOrderSelection(order: OrderForShipping): PalletOrderSelection {
    return {
      order: order,
      packages: order.packages.map(x => x.packingItemUID),
      disabled: [],
      expanded: false,
      selection: new SelectionModel<string>(true, []),
      totals: EmptyPackagingTotals,
    };
  }


  private emitPalletOrderSelection() {
    let packages: string[] = [];
    this.palletOrdersSelection.forEach(x => packages = [...packages, ...x.selection.selected]);

    const payload = {
      packages,
      totals: this.packagesTotal,
    };

    sendEvent(this.packagesSelectorEvent, PackagesSelectorEventType.SELECTION_CHANGES, payload);
  }

}
