/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { EmptyShipping, Shipping } from '@app/models';

@Component({
  selector: 'emp-trade-shipping-orders-resume',
  templateUrl: './shipping-orders-resume.component.html',
})
export class ShippingOrdersResumeComponent {

  @Input() shipping: Shipping = EmptyShipping;

}
