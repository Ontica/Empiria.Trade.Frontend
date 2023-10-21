/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EventInfo, Identifiable } from '@app/core';

import { DateRange, OrderQuery, OrderStatus, OrderStatusList } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum OrdersFilterEventType {
  SEARCH_CLICKED = 'OrdersFilterComponent.Event.SearchClicked',
}

interface OrdersFilterFormModel extends FormGroup<{
  keywords: FormControl<string>;
  period: FormControl<DateRange>;
  status: FormControl<OrderStatus>
}> { }

@Component({
  selector: 'emp-trade-orders-filter',
  templateUrl: './orders-filter.component.html',
})
export class OrdersFilterComponent {

  @Output() ordersFilterEvent = new EventEmitter<EventInfo>();

  form: OrdersFilterFormModel;

  statusList: Identifiable[] = OrderStatusList;

  constructor() {
    this.initForm();
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.ordersFilterEvent, OrdersFilterEventType.SEARCH_CLICKED, { query: this.getOrdersQuery() });
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      keywords: [''],
      period: [null],
      status: [null],
    });
  }


  private getOrdersQuery(): OrderQuery {
    const query: OrderQuery = {
      keywords: this.form.value.keywords ?? null,
      fromDate: !!this.form.value.period?.fromDate ? this.form.value.period?.fromDate : null,
      toDate: !!this.form.value.period?.toDate ? this.form.value.period?.toDate : null,
      status: this.form.value.status ?? null,
    };

    return query;
  }

}
