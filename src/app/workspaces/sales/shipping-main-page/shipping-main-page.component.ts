/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { ShippingDataService } from '@app/data-services';

import { EmptyShippingData, ShippingData, ShippingQuery } from '@app/models';

import {
  ShippingExplorerEventType
} from '@app/views/shipping-and-handling/shipping/shipping-explorer/shipping-explorer.component';

import {
  ShippingViewerEventType
} from '@app/views/shipping-and-handling/shipping/shipping-viewer/shipping-viewer.component';

import {
  ShippingEditorEventType
} from '@app/views/shipping-and-handling/shipping/shipping-editor/shipping-editor.component';

@Component({
  selector: 'emp-trade-shipping-main-page',
  templateUrl: './shipping-main-page.component.html',
})
export class ShippingMainPageComponent {

  shippingList: ShippingData[] = [];

  isLoading = false;

  queryExecuted = false;

  isLoadingShipping = false;

  displayShippingCreator = false;

  displayShippingViewer = false;

  shippingDataSelected: ShippingData = EmptyShippingData;


  constructor(private shippingData: ShippingDataService) { }


  onShippingExplorerEvent(event: EventInfo) {
    switch (event.type as ShippingExplorerEventType) {
      case ShippingExplorerEventType.CREATE_SHIPPING_BUTTON_CLICKED:
        this.displayShippingCreator = true;
        return;

      case ShippingExplorerEventType.SEARCH_SHIPPINGS_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.searchShipping(event.payload.query as ShippingQuery);
        return;

        case ShippingExplorerEventType.SELECT_SHIPPING_CLICKED:
        Assertion.assertValue(event.payload.shippingData, 'event.payload.shippingData');
        this.setShippingDataSelected(event.payload.shippingData as ShippingData);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }



  onShippingViewerEvent(event: EventInfo) {
    switch (event.type as ShippingViewerEventType) {
      case ShippingViewerEventType.CLOSE_BUTTON_CLICKED:
        this.setShippingDataSelected(EmptyShippingData);
        return;

      case ShippingViewerEventType.SHIPPING_UPDATED:
        Assertion.assertValue(event.payload.shippingData, 'event.payload.shippingData');
        this.insertShippingToList(event.payload.shippingData as ShippingData);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingCreatorEvent(event: EventInfo) {
    switch (event.type as ShippingEditorEventType) {
      case ShippingEditorEventType.CLOSE_BUTTON_CLICKED:
        this.displayShippingCreator = false;
        return;

      case ShippingEditorEventType.SHIPPING_UPDATED:
      case ShippingEditorEventType.SHIPPING_SENT:
        Assertion.assertValue(event.payload.shippingData, 'event.payload.shippingData');
        this.insertShippingToList(event.payload.shippingData as ShippingData);
        this.setShippingDataSelected(event.payload.shippingData as ShippingData);
        this.displayShippingCreator = false;
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
    this.setShippingData(data);
    this.setShippingDataSelected(EmptyShippingData);
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


  private setShippingDataSelected(shippingData: ShippingData) {
    this.shippingDataSelected = shippingData;
    this.displayShippingViewer = !!this.shippingDataSelected.shippingUID;
  }


  private insertShippingToList(shippingData: ShippingData) {
    const shippingListNew = ArrayLibrary.insertItemTop(this.shippingList, shippingData, 'shippingUID');
    this.setShippingData(shippingListNew);
    this.setShippingDataSelected(shippingData);
  }

}
