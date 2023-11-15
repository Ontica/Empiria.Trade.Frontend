/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Identifiable } from '@app/core';

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
    if (this.orderType === OrderQueryType.SalesAuthorization) {
      this.getOrderStatusForAuthorizations();
    } else {
      this.getOrderStatus();
    }
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


  private getOrderStatus() {
    this.isLoading = true;

    this.salesOrdersData.getOrderStatus()
      .firstValue()
      .then(x => this.setStatusList(x))
      .finally(() => this.isLoading = false);
  }


  private getOrderStatusForAuthorizations() {
    this.isLoading = true;

    this.salesOrdersData.getOrderStatusForAuthorizations()
      .firstValue()
      .then(x => this.setStatusList(x))
      .finally(() => this.isLoading = false);
  }


  private setStatusList(status: Identifiable[]) {
    this.statusList = status;
    // if (this.statusRequired) {
    //   this.form.controls.status.reset(this.statusList.length > 0 ? this.statusList[0].uid : null)
    //   this.formHelper.setControlValidators(this.form.controls.status, Validators.required);
    // } else {
    //   this.form.controls.status.reset('');
    //   this.formHelper.clearControlValidators(this.form.controls.status);
    // }
  }

}
