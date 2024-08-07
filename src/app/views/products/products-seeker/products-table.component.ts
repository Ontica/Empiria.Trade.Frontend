/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { Assertion, EventInfo } from '@app/core';

import { ProductDescriptor } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { GalleryImage } from '@app/shared/components/gallery/gallery.component';

import { ProductDataEventType } from '../../products/product-data/product-data.component';

import { ProductPresentationsEventType } from '@app/views/products/product-data/product-presentations.component';

import { ProductLocationEventType } from '../product-data/product-location.component';

import { ProductInputEventType } from '../product-data/product-input.component';

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

  @Input() displayOutputSelection = false;

  @Input() displayInputSelection = false;

  @Input() displayLocationSelection = false;

  @Input() queryExecuted = true;

  @Input() isLoading = false;

  @Output() productsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['image', 'product', 'attributes', 'presentations'];

  dataSource: TableVirtualScrollDataSource<ProductDescriptor>;

  imageSelected: GalleryImage = null;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.products) {
      this.initDataSource();
      this.scrollToTop();
    }
  }


  onProductImageClicked(event) {
    Assertion.assert(event.imageUrl, 'event.imageUrl');
    Assertion.assert(event.imageName, 'event.imageName');

    this.imageSelected = {
      url: event.imageUrl,
      name: event.imageName,
    };
  }


  onProductDataEvent(event: EventInfo) {
    if (event.type as ProductDataEventType === ProductDataEventType.SELECT_PRODUCT_CLICKED) {
      Assertion.assert(event.payload.product.productUID, 'event.payload.product.productUID');
      const product = this.dataSource.data.find(x => x.productUID === event.payload.product.productUID);
      sendEvent(this.productsTableEvent, ProductsTableEventType.SELECT_PRODUCT_CLICKED, { product });
    }
  }


  onProductPresentationEvent(event: EventInfo) {
    switch (event.type as ProductPresentationsEventType) {
      case ProductPresentationsEventType.ADD_PRODUCT_CLICKED:
        sendEvent(this.productsTableEvent, ProductsTableEventType.ADD_PRODUCT_CLICKED, event.payload);
        return;
      default:
        return;
    }
  }


  onProductLocationEvent(event: EventInfo) {
    switch (event.type as ProductLocationEventType) {
      case ProductLocationEventType.ADD_PRODUCT_CLICKED:
        sendEvent(this.productsTableEvent, ProductsTableEventType.ADD_PRODUCT_CLICKED, event.payload);
        return;
      default:
        return;
    }
  }


  onProductInputEvent(event: EventInfo) {
    switch (event.type as ProductInputEventType) {
      case ProductInputEventType.ADD_PRODUCT_CLICKED:
        sendEvent(this.productsTableEvent, ProductsTableEventType.ADD_PRODUCT_CLICKED, event.payload);
        return;
      default:
        return;
    }
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
