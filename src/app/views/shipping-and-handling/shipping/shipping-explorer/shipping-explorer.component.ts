/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ShippingDataService } from '@app/data-services';

import { ShippingData, ShippingQuery } from '@app/models';

import { ShippingFilterEventType } from './shipping-filter.component';


@Component({
  selector: 'emp-trade-shipping-explorer',
  templateUrl: './shipping-explorer.component.html',
})
export class ShippingExplorerComponent {

  cardHint = 'Seleccionar los filtros';

  shippingList: ShippingData[] = [];

  isLoading = false;

  queryExecuted = false;


  constructor(private shippingData: ShippingDataService,
              private messageBox: MessageBoxService) { }


  onCreateShipingClicked() {
    this.messageBox.showInDevelopment('Agregar envío');
  }


  onShippingFilterEvent(event: EventInfo) {
    switch (event.type as ShippingFilterEventType) {

      case ShippingFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.searchShipping(event.payload.query as ShippingQuery);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchShipping(query: ShippingQuery) {
    this.clearData();

    this.shippingData.searchShipping(query)
      .firstValue()
      .then(x => this.resolveSearchData(x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchData(data: ShippingData[]) {
    this.setShippingData(data)
    this.setText();
  }


  private setShippingData(data: ShippingData[], queryExecuted: boolean = true) {
    this.shippingList = data;
    this.queryExecuted = queryExecuted;
  }


  private clearData() {
    this.shippingList = [];
    this.isLoading = true;
    this.queryExecuted = false;
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.shippingList.length} registros encontrados`;
  }

}
