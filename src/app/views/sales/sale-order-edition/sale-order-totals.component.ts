/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { EmptySaleOrderTotals, SaleOrderTotals } from '@app/models';

@Component({
  selector: 'emp-trade-sale-order-totals',
  templateUrl: './sale-order-totals.component.html',
})
export class SaleOrderTotalsComponent {

  @Input() orderTotals: SaleOrderTotals = EmptySaleOrderTotals;

}
