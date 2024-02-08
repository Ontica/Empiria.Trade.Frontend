/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EventInfo } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { ShippingQuery } from '@app/models';

export enum ShippingFilterEventType {
  SEARCH_CLICKED = 'ShippingFilterComponent.Event.SearchClicked',
}

interface ShippingFilterFormModel extends FormGroup<{
  keywords: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-shipping-filter',
  templateUrl: './shipping-filter.component.html',
})
export class ShippingFilterComponent {

  @Input() queryExecuted: boolean = false;

  @Output() shippingFilterEvent = new EventEmitter<EventInfo>();

  form: ShippingFilterFormModel;

  formHelper = FormHelper;


  constructor() {
    this.initForm();
  }


  onSearchClicked() {
    if (this.form.valid) {
      const payload = { query: this.getShippingQuery() };
      sendEvent(this.shippingFilterEvent, ShippingFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      keywords: [''],
    });
  }


  private getShippingQuery(): ShippingQuery {
    const query: ShippingQuery = {
      keywords: this.form.value.keywords ?? null,
    };

    return query;
  }

}
