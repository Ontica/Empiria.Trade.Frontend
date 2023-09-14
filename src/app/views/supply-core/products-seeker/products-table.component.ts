/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { EventInfo } from '@app/core';

import { Product, ProductForSeeker, mapProductForSeekerFromProduct } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';

import { sendEvent } from '@app/shared/utils';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

export enum ProductsTableEventType {
  ENTRY_CLICKED = 'ProductsTableComponent.Event.EntryClicked',
  EXPORT_DATA   = 'ProductsTableComponent.Event.ExportData',
}

@Component({
  selector: 'emp-trade-products-table',
  templateUrl: './products-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [expandCollapse],
})
export class ProductsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() products: Product[] = [];

  @Input() productSelected: Product = null;

  @Input() queryExecuted = true;

  @Input() isLoading = false;

  @Input() showExportButton = true;

  @Output() productsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = [];

  dataSource: TableVirtualScrollDataSource<ProductForSeeker>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.products) {
      this.initDataSource();
      this.scrollToTop();
    }
  }


  onProductsControlsEvent(event: EventInfo) {
    sendEvent(this.productsTableEvent, ProductsTableEventType.EXPORT_DATA);
  }


  onProductClicked(product: Product) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.productsTableEvent, ProductsTableEventType.ENTRY_CLICKED, { product });
    }
  }


  private initDataSource() {
    this.displayedColumns = ['product', 'attributes', 'presentations']; // 'actionCopy',

    this.dataSource =
      new TableVirtualScrollDataSource(this.products.map(x => mapProductForSeekerFromProduct(x)));
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
