/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { ShippingData } from '@app/models';


@Component({
  selector: 'emp-trade-shipping-table',
  templateUrl: './shipping-table.component.html',
})
export class ShippingTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() shippingList: ShippingData[] = [];

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  displayedColumns = ['shippingDate', 'parcelSupplier', 'shippingGuide', 'parcelAmount', 'customerAmount',
                      'ordersCount', 'ordersTotal', 'totalPackages', 'totalWeight', 'totalVolume'];

  dataSource: TableVirtualScrollDataSource<ShippingData>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.shippingList) {
      this.setDataTable();
      this.scrollToTop();
    }
  }


  private setDataTable() {
    this.dataSource = new TableVirtualScrollDataSource(this.shippingList);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
