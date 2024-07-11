/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { EmptyInventoryReportQuery, EmptyReportType, InventoryReportQuery, InventoryReportType,
         InventoryReportTypesList, ReportGroup, ReportType } from '@app/models';


export enum InventoryReportFilterEventType {
  BUILD_REPORT_CLICKED = 'InventoryReportFilterComponent.Event.BuildReportClicked',
}

interface InventoryReportFilterFormModel extends FormGroup<{
  reportTypeUID: FormControl<string>;
  products: FormControl<string[]>;
  warehouseBins: FormControl<string[]>;
  keywords: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-inventory-report-filter',
  templateUrl: './inventory-report-filter.component.html',
})
export class InventoryReportFilterComponent implements OnChanges, OnDestroy {

  @Input() reportGroup: ReportGroup;

  @Input() query: InventoryReportQuery = EmptyInventoryReportQuery;

  @Output() inventoryReportFilterEvent = new EventEmitter<EventInfo>();

  form: InventoryReportFilterFormModel;

  formHelper = FormHelper;

  reportTypeList: ReportType[] = InventoryReportTypesList;

  productsAPI = SearcherAPIS.products;

  locationsAPI = SearcherAPIS.warehouseBins;

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get productFieldRequired(): boolean {
    return this.form.value.reportTypeUID === InventoryReportType.StocksByProduct;
  }


  get locationFieldRequired(): boolean {
    return this.form.value.reportTypeUID === InventoryReportType.StocksByLocation;
  }


  onReportTypeChanges() {
    this.form.controls.products.reset(null);
    this.form.controls.warehouseBins.reset(null);
    this.form.controls.keywords.reset('');

    if (this.productFieldRequired) {
      FormHelper.setControlValidators(this.form.controls.products, [Validators.required]);
      FormHelper.clearControlValidators(this.form.controls.warehouseBins);
    }

    if (this.locationFieldRequired) {
      FormHelper.setControlValidators(this.form.controls.warehouseBins, [Validators.required]);
      FormHelper.clearControlValidators(this.form.controls.products);
    }
  }


  onBuildReportClicked() {
    if (this.form.invalid) {
      FormHelper.markFormControlsAsTouched(this.form);
      return;
    }

    const reportType = this.reportTypeList.find(x => x.uid === this.form.value.reportTypeUID);

    const payload = {
      query: this.getReportQuery(),
      reportType: isEmpty(reportType) ? EmptyReportType : reportType,
    };

    sendEvent(this.inventoryReportFilterEvent,
      InventoryReportFilterEventType.BUILD_REPORT_CLICKED, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      reportTypeUID: ['', Validators.required],
      products: [null],
      warehouseBins: [null],
      keywords: [''],
    });
  }


  private setFormData() {
    this.form.reset({
      reportTypeUID: this.query.reportType,
      products: this.query.products,
      warehouseBins: this.query.warehouseBins,
      keywords: this.query.keywords,
    });
  }


  private getReportQuery(): InventoryReportQuery {
    const data: InventoryReportQuery = {
      reportType: this.form.value.reportTypeUID,
      keywords: this.form.value.keywords,
    };

    this.validateReportQueryFields(data);

    return data;
  }


  private validateReportQueryFields(data: InventoryReportQuery) {
    if (this.productFieldRequired) {
      data.products = this.form.value.products ?? [];
    }

    if (this.locationFieldRequired) {
      data.warehouseBins = this.form.value.warehouseBins ?? [];
    }
  }

}
