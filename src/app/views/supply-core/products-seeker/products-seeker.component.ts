/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { Product, ProductQuery } from '@app/models';

import { ProductsDataService } from '@app/data-services';

import { ProductsFilterEventType } from './products-filter.component';

import { ProductsTableEventType } from './products-table.component';

export enum ProductsSeekerEventType {
  ENTRY_CLICKED = 'ProductsSeekerComponent.Event.EntryClicked',
}

@Component({
  selector: 'emp-trade-products-seeker',
  templateUrl: './products-seeker.component.html',
})
export class ProductsSeekerComponent implements OnInit {

  @Input() title = 'Buscador de productos';

  @Input() productSelected = null;

  @Output() productsSeekerEvent = new EventEmitter<EventInfo>();

  hintText = 'Ingrese el producto a buscar.';

  queryExecuted = false;

  isLoading = false;

  data: Product[] = [];


  constructor(private productsData: ProductsDataService) {

  }


  ngOnInit() {
    this.setText();
  }


  onProductsFilterEvent(event: EventInfo) {
    switch (event.type as ProductsFilterEventType) {

      case ProductsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.searchData(event.payload.query as ProductQuery);
        return;

      case ProductsFilterEventType.CLEAR_CLICKED:
        this.clearData();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProductsTableEvent(event: EventInfo) {
    switch (event.type as ProductsTableEventType) {

      case ProductsTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.productsSeekerEvent, ProductsSeekerEventType.ENTRY_CLICKED, event.payload.entry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private clearData() {
    this.queryExecuted = false;
    this.data = [];
    this.setText();
  }


  private searchData(query: ProductQuery) {
    this.isLoading = true;
    this.clearData();

    this.productsData.searchProducts(query)
      .firstValue()
      .then(x => this.data = x)
      .finally(() => this.setSearchFinally());
  }


  private setSearchFinally() {
    this.queryExecuted = true;
    this.isLoading = false;
    this.setText();
  }


  private setText() {
    if (!this.queryExecuted) {
      this.hintText = 'Ingrese el producto a buscar.';
      return;
    }

    this.hintText = `${this.data.length} registros encontrados`;
  }

}
