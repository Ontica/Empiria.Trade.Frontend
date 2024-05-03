/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { WarehouseBinForInventory } from '@app/models';

import { ProductsSeekerEventType } from '../products-seeker/products-seeker.component';


export enum ProductsLocationSelectorEventType {
  CLOSE_MODAL_CLICKED = 'ProductsLocationSelectorComponent.Event.CloseModalClicked',
  ADD_PRODUCT         = 'ProductsLocationSelectorComponent.Event.AddProduct',
}

@Component({
  selector: 'emp-trade-products-location-selector',
  templateUrl: './products-location-selector.component.html',
})
export class ProductsLocationSelectorComponent implements OnInit, OnDestroy {

  @Output() productsLocationSelectorEvent = new EventEmitter<EventInfo>();

  warehouseBinsList: WarehouseBinForInventory[] = [];

  helper: SubscriptionHelper;

  isLoading = false;


  constructor(private uiLayer: PresentationLayer,) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onClose() {
    sendEvent(this.productsLocationSelectorEvent, ProductsLocationSelectorEventType.CLOSE_MODAL_CLICKED);
  }


  onProductsSeekerEvent(event: EventInfo) {
    switch (event.type as ProductsSeekerEventType) {

      case ProductsSeekerEventType.ADD_PRODUCT:
        Assertion.assert(event.payload.selection, 'event.payload.selection');

        sendEvent(this.productsLocationSelectorEvent,
          ProductsLocationSelectorEventType.ADD_PRODUCT, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<WarehouseBinForInventory[]>(CataloguesStateSelector.WAREHOUSE_BINS)
      .subscribe(x => {
        this.warehouseBinsList = x;
        this.isLoading = false;
      });
  }

}
