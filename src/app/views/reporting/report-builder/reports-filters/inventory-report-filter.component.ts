/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { InventaryStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { EmptyInventoryReportQuery, EmptyReportType, InventoryReportQuery, InventoryReportTypesList,
         ReportGroup, ReportType } from '@app/models';


export enum InventoryReportFilterEventType {
  BUILD_REPORT_CLICKED = 'InventoryReportFilterComponent.Event.BuildReportClicked',
}

interface InventoryReportFilterFormModel extends FormGroup<{
  reportTypeUID: FormControl<string>;
  warehouses: FormControl<string[]>;
  locations: FormControl<string[]>;
  products: FormControl<string[]>;
  orders: FormControl<string[]>;
  keywords: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-inventory-report-filter',
  templateUrl: './inventory-report-filter.component.html',
})
export class InventoryReportFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() reportGroup: ReportGroup;

  @Input() query: InventoryReportQuery = EmptyInventoryReportQuery;

  @Output() inventoryReportFilterEvent = new EventEmitter<EventInfo>();

  form: InventoryReportFilterFormModel;

  formHelper = FormHelper;

  reportTypeList: ReportType[] = InventoryReportTypesList;

  warehousesList: Identifiable[] = [];

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


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onBuildReportClicked() {
    if (this.form.invalid) {
      FormHelper.markFormControlsAsTouched(this.form);
      return;
    }

    const payload = {
      query: this.getReportQuery(),
      reportType: this.getReportType(),
    };

    sendEvent(this.inventoryReportFilterEvent, InventoryReportFilterEventType.BUILD_REPORT_CLICKED, payload);
  }


  private getReportType() {
    const reportType = this.reportTypeList.find(x => x.uid === this.form.value.reportTypeUID);
    return isEmpty(reportType) ? EmptyReportType : reportType;
  }


   private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(InventaryStateSelector.WAREHOUSES)
      .subscribe(x => {
        this.warehousesList = x;
        this.isLoading = x.length === 0;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      reportTypeUID: ['', Validators.required],
      warehouses: [null],
      locations: [null],
      products: [null],
      orders: [null],
      keywords: [''],
    });
  }


  private setFormData() {
    this.form.reset({
      reportTypeUID: this.query.reportType,
      warehouses: this.query.warehouses,
      locations: this.query.locations,
      products: this.query.products,
      orders: this.query.products,
      keywords: this.query.keywords,
    });
  }


  private getReportQuery(): InventoryReportQuery {
    const data: InventoryReportQuery = {
      reportType: this.form.value.reportTypeUID,
      keywords: this.form.value.keywords,
      warehouses: this.form.value.warehouses,
      locations: this.form.value.locations,
      products: this.form.value.products,
      orders: this.form.value.orders,
    };

    return data;
  }

}
