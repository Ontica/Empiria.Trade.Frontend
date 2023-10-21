/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Attributes } from '@app/models';

@Component({
  selector: 'emp-trade-product-attributes',
  templateUrl: './product-attributes.component.html',
})
export class ProductAttributesComponent {

  @Input() attributes: Attributes[];

}
