/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { InventaryStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { EmptyInventoryOrdersQuery, InventoryOrdersQuery, EntityStatusList,
         OrdersQueryType } from '@app/models';


export enum InventoryOrdersFilterEventType {
  SEARCH_CLICKED = 'InventoryOrdersFilterComponent.Event.SearchClicked',
}

interface InventoryOrdersFilterFormModel extends FormGroup<{
  inventoryTypeUID: FormControl<string>;
  warehouseUID: FormControl<string>;
  status: FormControl<string>;
  keywords: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-inventory-orders-filter',
  templateUrl: './inventory-orders-filter.component.html',
})
export class InventoryOrdersFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: InventoryOrdersQuery = EmptyInventoryOrdersQuery;

  @Output() inventoryOrdersFilterEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: InventoryOrdersFilterFormModel;

  formHelper = FormHelper;

  inventoryTypesList: Identifiable[] = [];

  warehousesList: Identifiable[] = [];

  statusList: Identifiable[] = EntityStatusList;

  isLoading = false;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.inventoryOrdersFilterEvent, InventoryOrdersFilterEventType.SEARCH_CLICKED, {
        isFormValid: this.form.valid,
        query: this.getFormData(),
      });
    } else {
      FormHelper.markFormControlsAsTouched(this.form);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(InventaryStateSelector.INVENTORY_TYPES),
      this.helper.select<Identifiable[]>(InventaryStateSelector.WAREHOUSES),
    ])
    .subscribe(([a, b]) => {
      this.inventoryTypesList = a;
      this.warehousesList = b;
      this.isLoading = a.length === 0;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      inventoryTypeUID: [''],
      warehouseUID: [''],
      status: [''],
      keywords: [''],
    });
  }


  private setFormData() {
    this.form.reset({
      inventoryTypeUID: this.query.inventoryTypeUID,
      warehouseUID: this.query.warehouseUID,
      status: this.query.status,
      keywords: this.query.keywords,
    });
  }


  private getFormData(): InventoryOrdersQuery {
    const query: InventoryOrdersQuery = {
      queryType: OrdersQueryType.Inventory,
      inventoryTypeUID: this.form.value.inventoryTypeUID ?? '',
      warehouseUID: this.form.value.warehouseUID ?? '',
      status: this.form.value.status ?? '',
      keywords: this.form.value.keywords ?? '',
    };

    return query;
  }

}
