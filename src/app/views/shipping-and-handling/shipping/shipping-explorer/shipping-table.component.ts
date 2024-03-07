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

import { EmptyShippingData, ShippingData, ShippingQueryType, ShippingStatus,
         getShippingStatusName } from '@app/models';

export enum ShippingTableEventType {
  ITEM_CLICKED = 'ShippingTableComponent.Event.ItemClicked',
}

@Component({
  selector: 'emp-trade-shipping-table',
  templateUrl: './shipping-table.component.html',
})
export class ShippingTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() queryType: ShippingQueryType = ShippingQueryType.Shipping;

  @Input() shippingList: ShippingData[] = [];

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Input() shippingSelected: ShippingData = EmptyShippingData;

  @Output() shippingTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['shippingMethod', 'shippingDate', 'shippingID', 'customer', 'status',
                      'ordersCount','totalPackages'];

  dataSource: TableVirtualScrollDataSource<ShippingData>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.shippingList) {
      this.setDataTable();
      this.scrollToTop();
    }
  }


  get queryTypeName(): string {
    return this.queryType === ShippingQueryType.Delivery ? 'Embarque' : 'Envío';
  }


  getShippingStatusName(status: ShippingStatus): string {
    return getShippingStatusName(status);
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
