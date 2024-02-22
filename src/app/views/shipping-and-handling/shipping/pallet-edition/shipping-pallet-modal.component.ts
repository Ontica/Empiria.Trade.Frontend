/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyShipping, EmptyShippingPalletWithPackages, Shipping, ShippingPalletFields,
         ShippingPalletWithPackages } from '@app/models';

import { PackagesSelectorEventType } from './packages-selector.component';

import { PalletHeaderEventType } from './pallet-header.component';

export enum ShippingPalletModalEventType {
  CLOSE_MODAL_CLICKED = 'ShippingPalletModalComponent.Event.CloseButtonClicked',
  CREATE_PALLET       = 'ShippingPalletModalComponent.Event.CreatePallet',
  UPDATE_PALLET       = 'ShippingPalletModalComponent.Event.UpdatePallet',
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

  palletFields: ShippingPalletFields = { shippingPalletName: '', packages: [] }


  ngOnInit() {
    this.setTitles();
  }


  get isSaved(): boolean {
    return !!this.pallet.shippingPalletUID;
  }


  get isReady(): boolean {
    return !!this.palletFields.shippingPalletName && this.palletFields.packages.length > 0;
  }


  onClose() {
    sendEvent(this.shippingPalletModalEvent, ShippingPalletModalEventType.CLOSE_MODAL_CLICKED);
  }


  onPalletHeaderEvent(event: EventInfo ) {
    switch (event.type as PalletHeaderEventType) {
      case PalletHeaderEventType.DATA_CHANGES:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.palletFields.shippingPalletName = event.payload.data.palletName ?? '';
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
        this.palletFields.packages = event.payload.packages;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubmitButtonClicked() {
    if (this.isReady) {
      this.validateSaveShippingToEmit();
    }
  }


  private validateSaveShippingToEmit() {
    if (this.isSaved) {

      sendEvent(this.shippingPalletModalEvent, ShippingPalletModalEventType.UPDATE_PALLET,
        { shippingPalletUID: this.pallet.shippingPalletUID, shippingPalletFields: this.palletFields });

    } else {

      sendEvent(this.shippingPalletModalEvent, ShippingPalletModalEventType.CREATE_PALLET,
        { shippingPalletFields: this.palletFields });

    }
  }


  private setTitles() {
    this.titleText = this.isSaved ? 'Editar tarima - ' + this.pallet.shippingPalletName : 'Agregar tarima';
  }

}
