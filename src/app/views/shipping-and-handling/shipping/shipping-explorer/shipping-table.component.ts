/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyShippingData, ShippingData } from '@app/models';

export enum ShippingTableEventType {
  ITEM_CLICKED = 'ShippingTableComponent.Event.ItemClicked',
}

@Component({
  selector: 'emp-trade-shipping-table',
  templateUrl: './shipping-table.component.html',
})
export class ShippingTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() shippingList: ShippingData[] = [];

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Input() shippingSelected: ShippingData = EmptyShippingData;

  @Output() shippingTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['shippingDate', 'parcelSupplier', 'shippingGuide', 'status',
                      'ordersCount','totalPackages', 'totalWeight', 'totalVolume'];

  dataSource: TableVirtualScrollDataSource<ShippingData>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.shippingList) {
      this.setDataTable();
      this.scrollToTop();
    }
  }


  onShippingClicked(shippingData: ShippingData) {
    sendEvent(this.shippingTableEvent, ShippingTableEventType.ITEM_CLICKED, { shippingData });
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
