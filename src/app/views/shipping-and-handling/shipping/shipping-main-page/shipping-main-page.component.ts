/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { View } from '@app/main-layout';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary } from '@app/shared/utils';

import { ShippingDataService } from '@app/data-services';

import { EmptyShippingData, ShippingData, ShippingQuery, ShippingQueryType } from '@app/models';

import {
  ShippingExplorerEventType
} from '@app/views/shipping-and-handling/shipping/shipping-explorer/shipping-explorer.component';

import {
  ShippingTabbedViewEventType
} from '@app/views/shipping-and-handling/shipping/shipping-tabbed-view/shipping-tabbed-view.component';

import {
  ShippingEditorModalEventType
} from '@app/views/shipping-and-handling/shipping/shipping-editor-modal/shipping-editor-modal.component';


@Component({
  selector: 'emp-trade-shipping-main-page',
  templateUrl: './shipping-main-page.component.html',
})
export class ShippingMainPageComponent implements OnInit, OnDestroy {

  queryType: ShippingQueryType = ShippingQueryType.Shipping;

  shippingList: ShippingData[] = [];

  isLoading = false;

  queryExecuted = false;

  isLoadingShipping = false;

  displayShippingCreator = false;

  displayShippingViewer = false;

  shippingDataSelected: ShippingData = EmptyShippingData;

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private shippingData: ShippingDataService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.getCurrentView();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


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



  onShippingTabbedViewEvent(event: EventInfo) {
    switch (event.type as ShippingTabbedViewEventType) {
      case ShippingTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setShippingDataSelected(EmptyShippingData);
        return;

      case ShippingTabbedViewEventType.SHIPPING_UPDATED:
        Assertion.assertValue(event.payload.shippingData, 'event.payload.shippingData');
        this.insertShippingToList(event.payload.shippingData as ShippingData);
        return;

      case ShippingTabbedViewEventType.SHIPPING_DELETED:
        Assertion.assertValue(event.payload.shippingUID, 'event.payload.shippingUID');
        this.removeShippingToList(event.payload.shippingUID as string);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShippingCreatorEvent(event: EventInfo) {
    switch (event.type as ShippingEditorModalEventType) {
      case ShippingEditorModalEventType.CLOSE_BUTTON_CLICKED:
        this.displayShippingCreator = false;
        return;

      case ShippingEditorModalEventType.SHIPPING_UPDATED:
      case ShippingEditorModalEventType.SHIPPING_SENT:
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


  private getCurrentView() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.validateCurrentView(x.name));
  }


  private validateCurrentView(view: string) {
    switch (view) {

      case 'AlmacenesViews.Embarques':
        this.queryType = ShippingQueryType.Delivery;
        return;

      case 'VentasViews.Envios':
      default:
        this.queryType = ShippingQueryType.Shipping;
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


  private removeShippingToList(shippingUID: string) {
    const shippingListNew = this.shippingList.filter(x => x.shippingUID !== shippingUID);
    this.setShippingData(shippingListNew);
    this.setShippingDataSelected(EmptyShippingData);
  }

}
