/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { ProductDescriptor } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { ProductDataEventType } from '../../products/product-data/product-data.component';

export enum ProductsTableEventType {
  SELECT_PRODUCT_CLICKED = 'ProductsTableComponent.Event.SelectProductClicked',
  ADD_PRODUCT_CLICKED    = 'ProductsTableComponent.Event.AddProductClicked',
}

@Component({
  selector: 'emp-trade-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() products: ProductDescriptor[] = [];

  @Input() selectable = false;

  @Input() queryExecuted = true;

  @Input() isLoading = false;

  @Output() productsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['product', 'attributes', 'presentations'];

  dataSource: TableVirtualScrollDataSource<ProductDescriptor>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.products) {
      this.initDataSource();
      this.scrollToTop();
    }
  }


  onProductDataEvent(event: EventInfo) {
    if (event.type as ProductDataEventType === ProductDataEventType.SELECT_PRODUCT_CLICKED) {
      Assertion.assert(event.payload.product.productUID, 'event.payload.product.productUID');
      const product = this.dataSource.data.find(x => x.productUID === event.payload.product.productUID);
      sendEvent(this.productsTableEvent, ProductsTableEventType.SELECT_PRODUCT_CLICKED, { product });
    }
  }


  onProductPresentationEvent(event: EventInfo) {
    sendEvent(this.productsTableEvent, ProductsTableEventType.ADD_PRODUCT_CLICKED, event.payload);
  }


  private initDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.products);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
