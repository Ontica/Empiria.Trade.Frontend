/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ApplicationStatusService, EmpObservable, EventInfo, Identifiable } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { expandCollapse } from '@app/shared/animations/animations';

import { SalesOrdersDataService, SearcherAPIS } from '@app/data-services';

import { Customer, DateRange, OrderQuery, OrderQueryType, OrderShippingStatusList,
         ShippingMethodList } from '@app/models';


export enum OrdersFilterEventType {
  SEARCH_CLICKED = 'OrdersFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'OrdersFilterComponent.Event.ClearClicked',
}

interface OrdersFilterFormModel extends FormGroup<{
  status: FormControl<string>
  customer: FormControl<Customer>;
  keywords: FormControl<string>;
  period: FormControl<DateRange>;
  shippingMethod: FormControl<string>;
  shippingStatus: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-orders-filter',
  templateUrl: './orders-filter.component.html',
  animations: [expandCollapse],
})
export class OrdersFilterComponent implements OnChanges, OnInit {

  @Input() orderType: OrderQueryType = OrderQueryType.Sales;

  @Input() queryExecuted: boolean = false;

  @Output() ordersFilterEvent = new EventEmitter<EventInfo>();

  form: OrdersFilterFormModel;

  formHelper = FormHelper;

  statusList: Identifiable[] = [];

  shippingMethodList: Identifiable[] = ShippingMethodList;

  shippingStatusList: Identifiable[] = OrderShippingStatusList;

  customersWithContactsAPI = SearcherAPIS.customersWithContacts;

  isLoading = false;

  showFilters = false;


  constructor(private appStatus: ApplicationStatusService,
              private salesOrdersData: SalesOrdersDataService) {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryExecuted) {
      this.resetShowFilter();
    }
  }


  ngOnInit() {
    this.getStatusByOrderType();
  }


  onSearchClicked() {
    if (this.form.valid) {
      this.appStatus.canUserContinue().subscribe(x => x ? this.emitSearchClicked() : null );
    }
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
  }


  onClearFilters() {
    this.form.reset();
    const payload = { query: this.getOrdersQuery() };
    sendEvent(this.ordersFilterEvent, OrdersFilterEventType.CLEAR_CLICKED, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      status: [null],
      customer: [null],
      keywords: [''],
      shippingMethod: [null],
      shippingStatus: [null],
      period: [null],
    });
  }


  private resetShowFilter() {
    if (this.queryExecuted) {
      this.showFilters = false;
    }
  }


  private emitSearchClicked() {
    const payload = { query: this.getOrdersQuery() };
    sendEvent(this.ordersFilterEvent, OrdersFilterEventType.SEARCH_CLICKED, payload);
  }


  private getOrdersQuery(): OrderQuery {
    const query: OrderQuery = {
      queryType: this.orderType ?? null,
      keywords: this.form.value.keywords ?? null,
      fromDate: !!this.form.value.period?.fromDate ? this.form.value.period?.fromDate : null,
      toDate: !!this.form.value.period?.toDate ? this.form.value.period?.toDate : null,
      status: this.form.value.status ?? null,
      shippingMethod: this.form.value.shippingMethod ?? null,
      customerUID: this.form.value.customer?.uid ?? null,
      shippingStatus: this.form.value.shippingStatus ?? null,
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
      case OrderQueryType.SalesPacking:
        this.getStatus(this.salesOrdersData.getOrderStatusForPacking());
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
      .then(x => this.statusList = x)
      .finally(() => this.isLoading = false);
  }

}
