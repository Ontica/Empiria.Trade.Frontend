/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Observable, Subject, catchError, concat, debounceTime, delay, distinctUntilChanged, filter, of,
         switchMap, tap } from 'rxjs';

import { ApplicationStatusService, EmpObservable, EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { expandCollapse } from '@app/shared/animations/animations';

import { ContactsDataService, SalesOrdersDataService } from '@app/data-services';

import { Customer, DateRange, OrderQuery, OrderQueryType, ShippingMethodList } from '@app/models';


export enum OrdersFilterEventType {
  SEARCH_CLICKED = 'OrdersFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'OrdersFilterComponent.Event.ClearClicked',
}

interface OrdersFilterFormModel extends FormGroup<{
  keywords: FormControl<string>;
  period: FormControl<DateRange>;
  status: FormControl<string>
  shippingMethod: FormControl<string>;
  customer: FormControl<Customer>;
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

  customersList$: Observable<Customer[]>;

  customersInput$ = new Subject<string>();

  isCustomersLoading = false;

  minTermLength = 5;

  isLoading = false;

  showFilters = false;


  constructor(private appStatus: ApplicationStatusService,
              private salesOrdersData: SalesOrdersDataService,
              private contactsData: ContactsDataService) {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryExecuted) {
      this.resetShowFilter();
    }
  }


  get statusRequired(): boolean {
    return this.orderType === OrderQueryType.SalesAuthorization;
  }


  ngOnInit() {
    this.getStatusByOrderType();
    this.subscribeCustomersList();
  }


  onSearchClicked() {
    if (this.form.valid) {
      this.appStatus.canUserContinue().subscribe(x => x ? this.emitSearchClicked() : null );
    }
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.subscribeCustomersList();
  }


  onClearFilters() {
    this.form.reset();
    this.subscribeCustomersList();

    const payload = { query: this.getOrdersQuery() };
    sendEvent(this.ordersFilterEvent, OrdersFilterEventType.CLEAR_CLICKED, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      keywords: [''],
      period: [null],
      status: [null],
      shippingMethod: [null],
      customer: [null],
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


  private subscribeCustomersList() {
    this.customersList$ = concat(
      of(isEmpty(this.form.value.customer) ? [] : [this.form.value.customer]),
      this.customersInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.minTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.isCustomersLoading = true),
        switchMap(keyword =>
          this.contactsData.getCustomersWithContacts(keyword)
            .pipe(
              delay(2000),
              catchError(() => of([])),
              tap(() => this.isCustomersLoading = false)
            ))
      )
    );
  }

}
