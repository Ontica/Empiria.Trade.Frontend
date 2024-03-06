/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyShippingData, ShippingData, ShippingQueryType } from '@app/models';

import { ShippingFilterEventType } from './shipping-filter.component';

import { ShippingTableEventType } from './shipping-table.component';

export enum ShippingExplorerEventType {
  CREATE_SHIPPING_BUTTON_CLICKED = 'ShippingExplorerComponent.Event.CreateShippingButtonClicked',
  SEARCH_SHIPPINGS_CLICKED       = 'ShippingExplorerComponent.Event.SearchShippingClicked',
  SELECT_SHIPPING_CLICKED        = 'ShippingExplorerComponent.Event.SelectShippingClicked',
}

@Component({
  selector: 'emp-trade-shipping-explorer',
  templateUrl: './shipping-explorer.component.html',
})
export class ShippingExplorerComponent implements OnChanges {

  @Input() queryType: ShippingQueryType = ShippingQueryType.Shipping;

  @Input() shippingList: ShippingData[] = [];

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Input() shippingSelected: ShippingData = EmptyShippingData;

  @Output() shippingExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Explorador de envíos';

  cardHint = 'Seleccionar los filtros';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryType || changes.shippingList) {
      this.setText();
    }
  }


  get canCreateShipping(): boolean {
    return this.queryType === ShippingQueryType.Shipping;
  }


  onCreateShipingClicked() {
    sendEvent(this.shippingExplorerEvent, ShippingExplorerEventType.CREATE_SHIPPING_BUTTON_CLICKED);
  }


  onShippingFilterEvent(event: EventInfo) {
    switch (event.type as ShippingFilterEventType) {
      case ShippingFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.shippingExplorerEvent,
          ShippingExplorerEventType.SEARCH_SHIPPINGS_CLICKED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingTableEvent(event: EventInfo) {
    switch (event.type as ShippingTableEventType) {
      case ShippingTableEventType.ITEM_CLICKED:
        Assertion.assertValue(event.payload.shippingData.shippingUID, 'event.payload.shippingData.shippingUID');
        sendEvent(this.shippingExplorerEvent,
          ShippingExplorerEventType.SELECT_SHIPPING_CLICKED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    this.cardTitle = this.queryType === ShippingQueryType.Delivery ? 'Explorador de embarques' :
      'Explorador de envíos';

    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.shippingList.length} registros encontrados`;
  }

}
