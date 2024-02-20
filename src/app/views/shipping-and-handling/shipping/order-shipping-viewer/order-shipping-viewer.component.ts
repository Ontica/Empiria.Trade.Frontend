/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { EmptyPackingData, EmptyShippingData, PackingData, ShippingData } from '@app/models';

@Component({
  selector: 'emp-trade-order-shipping-viewer',
  templateUrl: './order-shipping-viewer.component.html',
})
export class OrderShippingViewerComponent {

  @Input() shippingData: ShippingData = EmptyShippingData;

  @Input() packingData: PackingData = EmptyPackingData;


  get packingDataValid(): PackingData {
    return this.packingData ?? EmptyPackingData;
  }


  get shippingDataValid(): ShippingData {
    return this.shippingData ?? EmptyShippingData;
  }

}
