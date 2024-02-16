/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyShipping, EmptyShippingPalletWithPackages, Shipping,
         ShippingPalletWithPackages } from '@app/models';

import { PackagesSelectorEventType } from './packages-selector.component';

import { PalletHeaderEventType } from './pallet-header.component';

export enum ShippingPalletModalEventType {
  CLOSE_MODAL_CLICKED = 'ShippingPalletModalComponent.Event.CloseButtonClicked',
  PALLET_SAVED        = 'ShippingPalletModalComponent.Event.PalletSaved',
}

@Component({
  selector: 'emp-trade-shipping-pallet-modal',
  templateUrl: './shipping-pallet-modal.component.html',
})
export class ShippingPalletModalComponent implements OnInit {

  @Input() shipping: Shipping = EmptyShipping;

  @Input() canEdit = false;

  @Input() pallet: ShippingPalletWithPackages = EmptyShippingPalletWithPackages;

  @Output() shippingPalletModalEvent = new EventEmitter<EventInfo>();

  titleText = 'Agregar tarima';

  hintText = 'Información del contenido de la tarima.';

  submitted = false;

  palletName: string = '';

  packagesSelected: string[] = [];


  constructor(private messageBox: MessageBoxService) { }


  ngOnInit() {
    this.setTitles();
  }


  get isReady(): boolean {
    return !!this.palletName && this.packagesSelected.length > 0;
  }


  onClose() {
    sendEvent(this.shippingPalletModalEvent, ShippingPalletModalEventType.CLOSE_MODAL_CLICKED);
  }


  onPalletHeaderEvent(event: EventInfo ) {
    switch (event.type as PalletHeaderEventType) {
      case PalletHeaderEventType.DATA_CHANGES:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.palletName = event.payload.data.palletName ?? '';
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPackagesSelectorEvent(event: EventInfo) {
    switch (event.type as PackagesSelectorEventType) {
      case PackagesSelectorEventType.SELECTION_CHANGES:
        Assertion.assertValue(event.payload.packages, 'event.payload.packages');
        Assertion.assertValue(event.payload.totals, 'event.payload.totals');
        this.packagesSelected = event.payload.packages;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubmitButtonClicked() {
    if (this.isReady) {

      const palletFields = {
        shippingUID: this.shipping.shippingData.shippingUID,
        shippingPalletName: this.palletName,
        packages: this.packagesSelected,
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


  private setTitles() {
    this.titleText = this.pallet.shippingPalletUID ?
      'Editar tarima - ' + this.pallet.shippingPalletName : 'Agregar tarima';
  }

}
