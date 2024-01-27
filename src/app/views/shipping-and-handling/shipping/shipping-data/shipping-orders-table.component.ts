/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EmptyShipping, OrderForShipping, Shipping } from '@app/models';

@Component({
  selector: 'emp-trade-shipping-orders-table',
  templateUrl: './shipping-orders-table.component.html',
})
export class ShippingOrdersTableComponent implements OnChanges {

  @Input() shipping: Shipping = EmptyShipping;

  displayedColumns: string[] = ['ID', 'orderName', 'orderTotal', 'totalPackages', 'totalWeight', 'totalVolume' ];

  dataSource: MatTableDataSource<OrderForShipping>;


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.shipping.ordersForShipping);
  }

}
