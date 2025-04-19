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

import { EmptyInventoryOrdersQuery, InventoryOrdersQuery, EntityStatusList,
         OrdersQueryType } from '@app/models';


export enum InventoryOrdersFilterEventType {
  SEARCH_CLICKED = 'InventoryOrdersFilterComponent.Event.SearchClicked',
}

interface InventoryOrdersFilterFormModel extends FormGroup<{
  status: FormControl<string>;
  keywords: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-inventory-orders-filter',
  templateUrl: './inventory-orders-filter.component.html',
})
export class InventoryOrdersFilterComponent implements OnChanges {

  @Input() query: InventoryOrdersQuery = EmptyInventoryOrdersQuery;

  @Output() inventoryOrdersFilterEvent = new EventEmitter<EventInfo>();

  form: InventoryOrdersFilterFormModel;

  formHelper = FormHelper;

  inventoryTypesList: Identifiable[] = [];

  assignedToList: Identifiable[] = [];

  statusList: Identifiable[] = EntityStatusList;

  isLoading = false;


  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }
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
      status: [''],
      keywords: [''],
    });
  }


  private setFormData() {
    this.form.reset({
      status: this.query.status,
      keywords: this.query.keywords,
    });
  }


  private getFormData(): InventoryOrdersQuery {
    const query: InventoryOrdersQuery = {
      queryType: OrdersQueryType.Inventory,
      status: this.form.value.status ?? '',
      keywords: this.form.value.keywords ?? '',
    };

    return query;
  }

}
