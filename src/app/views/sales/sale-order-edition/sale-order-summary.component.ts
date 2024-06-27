/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptySaleOrderData, SaleOrderData } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { SaleOrderAdditionalDataComponent } from './sale-order-additional-data.component';

export enum SaleOrderSummaryEventType {
  CHANGE_DATA = 'SaleOrderSummaryComponent.Event.ChangeData',
}

@Component({
  selector: 'emp-trade-sale-order-summary',
  templateUrl: './sale-order-summary.component.html',
})
export class SaleOrderSummaryComponent  {

  @ViewChild('additionalData') additionalData: SaleOrderAdditionalDataComponent;

  @Input() orderData: SaleOrderData = EmptySaleOrderData;

  @Input() editionMode = false;

  @Input() isSaved = false;

  @Output() saleOrderSummaryEvent = new EventEmitter<EventInfo>();


  invalidateForm() {
    this.additionalData.invalidateForm();
  }


  onSaleOrderAdditionalDataEvent(event: EventInfo) {
    sendEvent(this.saleOrderSummaryEvent, SaleOrderSummaryEventType.CHANGE_DATA, event.payload);
  }

}
