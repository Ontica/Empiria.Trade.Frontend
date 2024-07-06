/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EventInfo, Identifiable } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { expandCollapse } from '@app/shared/animations/animations';

import { SearcherAPIS } from '@app/data-services';

import { EmptyPurchaseOrdersQuery, PurchaseOrdersQuery, PurchaseOrdersQueryType,
         PurchaseStatusList } from '@app/models';


export enum PurchaseOrdersFilterEventType {
  SEARCH_CLICKED = 'PurchaseOrdersFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'PurchaseOrdersFilterComponent.Event.ClearClicked',
}

interface PurchaseOrdersFilterFormModel extends FormGroup<{
  status: FormControl<string>
  keywords: FormControl<string>;
  supplierUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-purchase-orders-filter',
  templateUrl: './purchase-orders-filter.component.html',
  animations: [expandCollapse],
})
export class PurchaseOrdersFilterComponent implements OnChanges {

  @Input() orderType: string = PurchaseOrdersQueryType.Purchase;

  @Input() query: PurchaseOrdersQuery = EmptyPurchaseOrdersQuery;

  @Input() queryExecuted: boolean = false;

  @Output() purchaseOrdersFilterEvent = new EventEmitter<EventInfo>();

  form: PurchaseOrdersFilterFormModel;

  formHelper = FormHelper;

  statusList: Identifiable[] = PurchaseStatusList;

  suppliersAPI = SearcherAPIS.suppliers;

  isLoading = false;

  showFilters = false;


  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryExecuted) {
      this.resetShowFilter();
    }

    if (changes.query) {
      this.setFormData();
    }
  }


  onSearchClicked() {
    if (this.form.valid) {
      const payload = { query: this.getPurchasesQuery() };
      sendEvent(this.purchaseOrdersFilterEvent, PurchaseOrdersFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
  }


  onClearFilters() {
    this.form.reset();
    const payload = { query: this.getPurchasesQuery() };
    sendEvent(this.purchaseOrdersFilterEvent, PurchaseOrdersFilterEventType.CLEAR_CLICKED, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      status: [null],
      keywords: [null],
      supplierUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      status: this.query.status,
      keywords: this.query.keywords,
      supplierUID: this.query.supplierUID,
    });
  }


  private resetShowFilter() {
    if (this.queryExecuted) {
      this.showFilters = false;
    }
  }


  private getPurchasesQuery(): PurchaseOrdersQuery {
    const query: PurchaseOrdersQuery = {
      queryType: this.orderType ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      supplierUID: this.form.value.supplierUID ?? null,
    };

    return query;
  }

}
