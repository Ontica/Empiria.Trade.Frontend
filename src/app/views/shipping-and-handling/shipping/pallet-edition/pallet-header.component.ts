/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyShippingPalletWithPackages, ShippingPalletWithPackages } from '@app/models';

export enum PalletHeaderEventType {
  DATA_CHANGES = 'PalletHeaderComponent.Event.DataChanges',
}

@Component({
  selector: 'emp-trade-pallet-header',
  templateUrl: './pallet-header.component.html',
})
export class PalletHeaderComponent implements OnInit {

  @Input() pallet: ShippingPalletWithPackages = EmptyShippingPalletWithPackages;

  @Input() canEdit: boolean = false;

  @Output() palletHeaderEvent = new EventEmitter<EventInfo>();

  palletName: string = '';


  ngOnInit() {
    this.setFormData();
    this.onDataChanges();
  }


  onDataChanges() {
    const payload = { data: this.getFormData() };
    sendEvent(this.palletHeaderEvent, PalletHeaderEventType.DATA_CHANGES, payload);
  }


  private setFormData() {
    this.palletName = this.pallet.shippingPalletName;
  }


  private getFormData() {
    return { palletName: this.palletName };
  }

}
