/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EmpObservable, EventInfo, Identifiable } from '@app/core';

import { SalesOrdersDataService } from '@app/data-services';

import { DateRange, OrderQuery, OrderQueryType } from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';

export enum OrdersFilterEventType {
  SEARCH_CLICKED = 'OrdersFilterComponent.Event.SearchClicked',
}

interface OrdersFilterFormModel extends FormGroup<{
  keywords: FormControl<string>;
  period: FormControl<DateRange>;
  status: FormControl<string>
}> { }

@Component({
  selector: 'emp-trade-orders-filter',
  templateUrl: './orders-filter.component.html',
})
export class OrdersFilterComponent implements OnInit {

  @Input() orderType: OrderQueryType = OrderQueryType.Sales;

  @Output() ordersFilterEvent = new EventEmitter<EventInfo>();

  form: OrdersFilterFormModel;

  formHelper = FormHelper;

  statusList: Identifiable[] = [];

  isLoading = false;


  constructor(private salesOrdersData: SalesOrdersDataService) {
    this.initForm();
  }


  get statusRequired(): boolean {
    return this.orderType === OrderQueryType.SalesAuthorization;
  }


  ngOnInit() {
    this.getStatusByOrderType();
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
      queryType: this.orderType ?? null,
      keywords: this.form.value.keywords ?? null,
      fromDate: !!this.form.value.period?.fromDate ? this.form.value.period?.fromDate : null,
      toDate: !!this.form.value.period?.toDate ? this.form.value.period?.toDate : null,
      status: this.form.value.status ?? null,
    };

    return query;
  }


  private getStatusByOrderType() {
    switch (this.orderType) {
      case OrderQueryType.Sales:
        this.getStatus(this.salesOrdersData.getOrderStatus());
        return;
      case OrderQueryType.SalesAuthorization:
        this.getStatus(this.salesOrdersData.getOrderStatusForAuthorizations());
        return;
      case OrderQueryType.SalesPackaging:
        this.getStatus(this.salesOrdersData.getOrderStatusForPackaging());
        return;
      default:
        console.log(`Unhandled status list for order type "${this.orderType}"`);
        return;
    }
  }


  private getStatus(observable: EmpObservable<Identifiable[]>) {
    this.isLoading = true;

    observable
      .firstValue()
      .then(x => this.setStatusList(x))
      .finally(() => this.isLoading = false);
  }


  private setStatusList(status: Identifiable[]) {
    this.statusList = status;
  }

}
