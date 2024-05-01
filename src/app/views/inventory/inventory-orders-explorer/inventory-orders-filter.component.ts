/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { ContactsDataService } from '@app/data-services';

import { EmptyInventoryOrderQuery, InventoryOrderQuery, InventoryStatusList } from '@app/models';


export enum InventoryOrdersFilterEventType {
  SEARCH_CLICKED = 'InventoryOrdersFilterComponent.Event.SearchClicked',
}

interface InventoryOrdersFilterFormModel extends FormGroup<{
  inventoryOrderTypeUID: FormControl<string>;
  status: FormControl<string>;
  assignedToUID: FormControl<string>;
  keywords: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-inventory-orders-filter',
  templateUrl: './inventory-orders-filter.component.html',
})
export class InventoryOrdersFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: InventoryOrderQuery = EmptyInventoryOrderQuery;

  @Input() queryExecuted: boolean = false;

  @Output() inventoryOrdersFilterEvent = new EventEmitter<EventInfo>();

  form: InventoryOrdersFilterFormModel;

  formHelper = FormHelper;

  inventoryTypesList: Identifiable[] = [];

  assignedToList: Identifiable[] = [];

  statusList: Identifiable[] = InventoryStatusList;

  helper: SubscriptionHelper;

  isLoading = false;


  constructor(private uiLayer: PresentationLayer,
              private contactsData: ContactsDataService) {
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


  onSearchClicked() {
    if (this.form.valid) {
      const payload = {
        isFormValid: this.form.valid,
        query: this.getFormData(),
      };

      sendEvent(this.inventoryOrdersFilterEvent, InventoryOrdersFilterEventType.SEARCH_CLICKED, payload);
    } else {
      FormHelper.markFormControlsAsTouched(this.form);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      inventoryOrderTypeUID: ['', Validators.required],
      status: [''],
      assignedToUID: [''],
      keywords: [''],
    });
  }


  private setFormData() {
    this.form.reset({
      inventoryOrderTypeUID: this.query.inventoryOrderTypeUID,
      status: this.query.status,
      assignedToUID: this.query.assignedToUID,
      keywords: this.query.keywords,
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.INVENTORY_ORDER_TYPES),
      this.contactsData.getWarehousemen()
    ])
    .subscribe(([x, y]) => {
      this.inventoryTypesList = x;
      this.assignedToList = y;
      this.isLoading = false;
    });
  }


  private getFormData(): InventoryOrderQuery {
    const query: InventoryOrderQuery = {
      inventoryOrderTypeUID: this.form.value.inventoryOrderTypeUID ?? '',
      status: this.form.value.status ?? '',
      assignedToUID: this.form.value.assignedToUID ?? '',
      keywords: this.form.value.keywords ?? '',
    };

    return query;
  }

}
