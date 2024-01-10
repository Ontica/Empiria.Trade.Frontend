/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Customer, CustomerCredit, EmptyCustomer, EmptyCustomerCredit } from '@app/models';

@Component({
  selector: 'emp-trade-customer-credit-view',
  templateUrl: './customer-credit-view.component.html',
})
export class CustomerCreditViewComponent {

  @Input() customer: Customer = EmptyCustomer;

  @Input() customerCredit: CustomerCredit = EmptyCustomerCredit;


  get customerCreditValid(): CustomerCredit {
    return this.customerCredit ?? EmptyCustomerCredit;
  }

}
