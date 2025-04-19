/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ApplicationStatusService, EmpObservable, EventInfo, Identifiable } from '@app/core';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { SalesDataService, SearcherAPIS } from '@app/data-services';

import { Customer, DateRange, SalesOrdersQuery, OrderShippingStatusList, OrdersQueryType,
         ShippingMethodList } from '@app/models';


export enum SalesOrdersFilterEventType {
  SEARCH_CLICKED = 'SalesOrdersFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'SalesOrdersFilterComponent.Event.ClearClicked',
}

interface SalesOrdersFilterFormModel extends FormGroup<{
  status: FormControl<string>
  customer: FormControl<Customer>;
  keywords: FormControl<string>;
  period: FormControl<DateRange>;
  shippingMethod: FormControl<string>;
  shippingStatus: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-sales-orders-filter',
  templateUrl: './sales-orders-filter.component.html',
  animations: [empExpandCollapse],
})
export class SalesOrdersFilterComponent implements OnChanges, OnInit {

  @Input() orderType: string = OrdersQueryType.Sales;

  @Input() queryExecuted: boolean = false;

  @Output() salesOrdersFilterEvent = new EventEmitter<EventInfo>();

  form: SalesOrdersFilterFormModel;

  formHelper = FormHelper;

  statusList: Identifiable[] = [];

  shippingMethodList: Identifiable[] = ShippingMethodList;

  shippingStatusList: Identifiable[] = OrderShippingStatusList;

  customersWithContactsAPI = SearcherAPIS.customersWithContacts;

  isLoading = false;

  showFilters = false;


  constructor(private appStatus: ApplicationStatusService,
              private salesData: SalesDataService) {
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
    const payload = { query: this.getSalesQuery() };
    sendEvent(this.salesOrdersFilterEvent, SalesOrdersFilterEventType.CLEAR_CLICKED, payload);
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
    const payload = { query: this.getSalesQuery() };
    sendEvent(this.salesOrdersFilterEvent, SalesOrdersFilterEventType.SEARCH_CLICKED, payload);
  }


  private getSalesQuery(): SalesOrdersQuery {
    const query: SalesOrdersQuery = {
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
    switch (this.orderType as OrdersQueryType) {
      case OrdersQueryType.Sales:
        this.getStatus(this.salesData.getOrderStatus());
        return;
      case OrdersQueryType.SalesAuthorization:
        this.getStatus(this.salesData.getOrderStatusForAuthorizations());
        return;
      case OrdersQueryType.SalesPacking:
        this.getStatus(this.salesData.getOrderStatusForPacking());
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
