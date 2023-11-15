/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { EmptyOrder, Order } from '@app/models';

@Component({
  selector: 'emp-trade-order-totals',
  templateUrl: './order-totals.component.html',
})
export class OrderTotalsComponent {

  @Input() order: Order = EmptyOrder();

}
