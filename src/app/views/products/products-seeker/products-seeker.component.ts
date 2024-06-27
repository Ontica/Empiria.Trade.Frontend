/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { Assertion, EmpObservable, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SaleOrderFields, ProductDescriptor, ProductQuery } from '@app/models';

import { ProductsDataService } from '@app/data-services';

import { ProductsFilterComponent, ProductsFilterEventType } from './products-filter.component';

import { ProductsTableEventType } from './products-table.component';

export type ProductSeekerQueryType = 'Products' | 'ProductsForOrder' | 'ProductsForInventory';

export enum ProductsSeekerEventType {
  SELECT_PRODUCT = 'ProductsSeekerComponent.Event.SelectProduct',
  ADD_PRODUCT    = 'ProductsSeekerComponent.Event.AddProduct',
}

@Component({
  selector: 'emp-trade-products-seeker',
  templateUrl: './products-seeker.component.html',
})
export class ProductsSeekerComponent implements OnInit {

  @ViewChild('productsFilter') productsFilter: ProductsFilterComponent;

  @Input() productSeekerQueryType: ProductSeekerQueryType = 'Products';

  @Input() order: SaleOrderFields = null;

  @Input() displayFlat = null;

  @Output() productsSeekerEvent = new EventEmitter<EventInfo>();

  resultText = 'Ingrese el producto a buscar.';

  queryExecuted = false;

  isLoading = false;

  data: ProductDescriptor[] = [];

  clearDataAfterAddProduct = true;


  constructor(private productsData: ProductsDataService) {

  }


  get displayOnStock(): boolean {
    return ['Products', 'ProductsForOrder'].includes(this.productSeekerQueryType);
  }


  get displayLocationSelection(): boolean {
    return ['ProductsForInventory'].includes(this.productSeekerQueryType);
  }


  ngOnInit() {
    this.setResultText();
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
      case ProductsTableEventType.SELECT_PRODUCT_CLICKED:
        Assertion.assertValue(event.payload.product, 'event.payload.product');
        sendEvent(this.productsSeekerEvent, ProductsSeekerEventType.SELECT_PRODUCT, event.payload);
        return;

      case ProductsTableEventType.ADD_PRODUCT_CLICKED:
        Assertion.assertValue(event.payload.selection, 'event.payload.selection');
        sendEvent(this.productsSeekerEvent, ProductsSeekerEventType.ADD_PRODUCT, event.payload);
        this.validateClearData();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private clearData() {
    this.queryExecuted = false;
    this.data = [];
    this.setResultText();
  }


  private validateClearData() {
    if (this.clearDataAfterAddProduct) {
      this.clearData();
      this.productsFilter.clearFilters();
    }
  }


  private searchData(query: ProductQuery) {
    const queryValid = this.buildProductQuery(query);
    let observable = null;

    switch (this.productSeekerQueryType) {
      case 'Products':
        observable = this.productsData.searchProducts(queryValid);
        break;

      case 'ProductsForOrder':
        observable = this.productsData.searchProductsForOrder(queryValid);
        break;

      case 'ProductsForInventory':
        observable = this.productsData.searchProductsForInventory(queryValid);
        break;

      default:
        console.log(`Unhandled product seeker query type ${this.productSeekerQueryType}`);
        return;
    }

    this.executeSearchProducts(observable);
  }


  private executeSearchProducts(observable: EmpObservable<any>) {
    this.isLoading = true;
    this.clearData();

    observable
      .firstValue()
      .then(x => this.data = x)
      .finally(() => this.setSearchFinally());
  }


  private buildProductQuery(query: ProductQuery) {
    const productQuery: ProductQuery = {...query};

    if (!!this.order) {
      productQuery.order = this.order;
    }

    return productQuery;
  }


  private setSearchFinally() {
    this.queryExecuted = true;
    this.isLoading = false;
    this.setResultText();
  }


  private setResultText() {
    if (!this.queryExecuted) {
      this.resultText = 'Ingrese el producto a buscar.';
      return;
    }

    this.resultText = `${this.data.length} registros encontrados`;
  }

}
