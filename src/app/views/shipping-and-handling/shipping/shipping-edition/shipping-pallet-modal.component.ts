/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { EventInfo } from '@app/core';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyShipping, EmptyShippingPalletWithPackages, EmptyShippingTotals, OrderForShipping, OrderPackage,
         Shipping, ShippingPalletWithPackages, ShippingTotals} from '@app/models';

export enum ShippingPalletModalEventType {
  CLOSE_MODAL_CLICKED = 'ShippingPalletModalComponent.Event.CloseButtonClicked',
  PALLET_SAVED        = 'ShippingPalletModalComponent.Event.PalletSaved',
}

interface PalletOrderSelection {
  order: OrderForShipping;
  packages: string[];
  disabled: string[];
  expanded: boolean;
  selection: SelectionModel<string>;
  totals: ShippingTotals;
}

@Component({
  selector: 'emp-trade-shipping-pallet-modal',
  templateUrl: './shipping-pallet-modal.component.html',
})
export class ShippingPalletModalComponent implements OnInit {

  @Input() shipping: Shipping = EmptyShipping;

  @Input() pallet: ShippingPalletWithPackages = EmptyShippingPalletWithPackages;

  @Output() shippingPalletModalEvent = new EventEmitter<EventInfo>();

  titleText = 'Agregar tarima';

  hintText = 'Información del contenido de la tarima.';

  submitted = false;

  palletName: string = '';

  palletOrdersSelection: PalletOrderSelection[] = [];

  packagesDisabled: string[] = [];


  constructor(private messageBox: MessageBoxService) { }


  ngOnInit() {
    this.setInitData();
  }


  get isReady(): boolean {
    return !!this.palletName && this.palletOrdersSelection.some(x => x.selection.hasValue());
  }


  onClose() {
    sendEvent(this.shippingPalletModalEvent, ShippingPalletModalEventType.CLOSE_MODAL_CLICKED);
  }


  onToggleExpandAllOrders(expanded: boolean) {
    this.palletOrdersSelection.forEach(x => x.expanded = expanded);
  }


  onToggleSelectAllOrders(select: boolean) {
    this.palletOrdersSelection.forEach(x => {
      if (select) {
        x.selection.select(...x.packages);
        x.selection.deselect(...this.packagesDisabled)
      } else {
        x.selection.clear();
      }
    });

    this.recalculateOrderTotals();
    this.recalculateTotals();
  }


  onSelectAllPackagesFromOrder(order: PalletOrderSelection, selection) {
    selection.deselect(...this.packagesDisabled)
    order.selection = selection;

    this.recalculateOrderTotals();
    this.recalculateTotals();
  }


  onSelectPackageToOrder(order: PalletOrderSelection, packageItem: OrderPackage) {
    order.selection.toggle(packageItem.packingItemUID);
    this.recalculateOrderTotals();
    this.recalculateTotals();
  }


  onSubmitButtonClicked() {
    if (this.isReady) {
      let packagesUID: string[] = [];

      this.palletOrdersSelection
        .forEach(x => packagesUID = [...packagesUID, ...x.selection.selected]);

      const palletFields = {
        shippingUID: this.shipping.shippingData.shippingUID,
        shippingPalletName: this.palletName,
        packagesUID
      }

      this.saveShippingPallet(palletFields);
    }
  }


  private saveShippingPallet(palletFields: any) {
    this.submitted = true;
    setTimeout(() => {
      this.submitted = false;
      this.messageBox.showInDevelopment(this.titleText, palletFields);
      sendEvent(this.shippingPalletModalEvent, ShippingPalletModalEventType.PALLET_SAVED,
        {shipping: this.shipping});
    }, 600);
  }


  private setInitData() {
    this.setFormData();
    this.setPalletOrdersSelectionOrdered();
    this.setPackagesDisabled();
    this.setPackagesSelected();
    this.recalculateOrderTotals();
    this.recalculateTotals();
  }


  private setFormData() {
    this.titleText = this.pallet.shippingPalletUID ?
      'Editar tarima - ' + this.pallet.shippingPalletName : 'Agregar tarima';
    this.palletName = this.pallet.shippingPalletName;
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
    })
  }


  private recalculateTotals() {
    setTimeout(() => {
      let selected = [];
      this.palletOrdersSelection.forEach(item => selected = [...selected, ...item.selection.selected]);

      let packages = [];
      this.shipping.ordersForShipping.forEach(item => packages = [...packages, ...item.packages]);
      const packagesSelected = packages.filter(x => selected.includes(x.packingItemUID));

      this.pallet.totalPackages = packagesSelected.length;
      this.pallet.totalWeight = packagesSelected.reduce((acum, value) => acum + value.totalWeight, 0);
      this.pallet.totalVolume = packagesSelected.reduce((acum, value) => acum + value.totalVolume, 0);
    });
  }


  private getPalletOrderSelection(order: OrderForShipping): PalletOrderSelection {
    return {
      order: order,
      packages: order.packages.map(x => x.packingItemUID),
      disabled: [],
      expanded: false,
      selection: new SelectionModel<string>(true, []),
      totals: EmptyShippingTotals,
    }
  }

}
