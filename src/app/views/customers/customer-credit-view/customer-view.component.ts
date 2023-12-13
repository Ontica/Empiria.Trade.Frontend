/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { FormHelper } from '@app/shared/utils';

import { Customer, CustomerCredit, EmptyCustomer, EmptyCustomerCredit } from '@app/models';


interface CustomerViewFormModel extends FormGroup<{
  customerName: FormControl<string>;
  creditLimit: FormControl<number>;
  totalDebt: FormControl<number>;
}> { }

@Component({
  selector: 'emp-trade-customer-view',
  templateUrl: './customer-view.component.html',
})
export class CustomerViewComponent implements OnChanges {

  @Input() customer: Customer = EmptyCustomer;

  @Input() customerCredit: CustomerCredit = EmptyCustomerCredit;

  form: CustomerViewFormModel;

  formHelper = FormHelper;


  constructor() {
    this.initForm();
  }


  ngOnChanges() {
    this.setFormData();
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      customerName: [''],
      creditLimit: [null],
      totalDebt: [null],
    });

    this.formHelper.setDisableForm(this.form);
  }


  private setFormData() {
    this.formHelper.setDisableForm(this.form, false);

    this.form.reset({
      customerName: this.customer.name,
      creditLimit: this.customerCredit.creditLimit,
      totalDebt: this.customerCredit.totalDebt,
    });

    this.formHelper.setDisableForm(this.form);
  }

}
