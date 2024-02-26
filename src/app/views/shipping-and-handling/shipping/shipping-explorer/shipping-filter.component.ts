/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EventInfo, Identifiable } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { ShippingDataService } from '@app/data-services';

import { ShippingQuery, ShippingStatusList } from '@app/models';

export enum ShippingFilterEventType {
  SEARCH_CLICKED = 'ShippingFilterComponent.Event.SearchClicked',
}

interface ShippingFilterFormModel extends FormGroup<{
  keywords: FormControl<string>;
  parcelSupplierUID: FormControl<string>;
  status: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-shipping-filter',
  templateUrl: './shipping-filter.component.html',
})
export class ShippingFilterComponent implements OnInit {

  @Input() queryExecuted: boolean = false;

  @Output() shippingFilterEvent = new EventEmitter<EventInfo>();

  form: ShippingFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  parcelSuppliersList: Identifiable[] = [];

  shippingStatusList: string[] = ShippingStatusList;


  constructor(private shippingDataService: ShippingDataService) {
    this.initForm();
  }


  ngOnInit() {
    this.loadDataList();
  }


  onSearchClicked() {
    if (this.form.valid) {
      const payload = { query: this.getShippingQuery() };
      sendEvent(this.shippingFilterEvent, ShippingFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  private loadDataList() {
    this.isLoading = true;

    this.shippingDataService.getParcelSuppliers()
      .subscribe(x => {
        this.parcelSuppliersList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      keywords: [null],
      parcelSupplierUID: [null],
      status: [null],
    });
  }


  private getShippingQuery(): ShippingQuery {
    const query: ShippingQuery = {
      keywords: this.form.value.keywords ?? null,
      parcelSupplierUID: this.form.value.parcelSupplierUID ?? null,
      status: this.form.value.status ?? null,
    };

    return query;
  }

}
