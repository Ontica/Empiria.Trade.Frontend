/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyShippingPalletWithPackages, OrderForShipping, OrderPackage,
         ShippingPalletWithPackages } from '@app/models';

import { SelectionModel } from '@angular/cdk/collections';

export enum ShippingPalletModalEventType {
  CLOSE_MODAL_CLICKED = 'ShippingPalletModalComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-trade-shipping-pallet-modal',
  templateUrl: './shipping-pallet-modal.component.html',
})
export class ShippingPalletModalComponent {

  @Input() orders: OrderForShipping[] = [];

  @Input() pallet: ShippingPalletWithPackages = EmptyShippingPalletWithPackages;

  @Output() shippingPalletModalEvent = new EventEmitter<EventInfo>();

  titleText = 'Agregar tarima';

  hintText = 'Información del contenido de la tarima.';

  submitted = false;

  palletName: string = '';

  selection = new SelectionModel<string>(true, []);



  onClose() {
    sendEvent(this.shippingPalletModalEvent, ShippingPalletModalEventType.CLOSE_MODAL_CLICKED);
  }


  togglePackageInPallet(packageUID: string) {
    if (this.pallet.packages.includes(packageUID)) {
      this.pallet.packages = this.pallet.packages.filter(x => x !== packageUID);
    } else {
      this.pallet.packages.push(packageUID)
    }
  }


  getValuesByOrder(packages: OrderPackage[]): string[] {
    return packages.map(x => x.packingItemUID) ?? [];
  }

}
