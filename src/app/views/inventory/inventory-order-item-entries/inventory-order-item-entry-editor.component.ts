/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { OrderItemEntry } from '@app/models';


export enum InventoryOrderItemEntryEditorEventType {
  ASSIGN_BUTTON_CLICKED = 'InventoryOrderItemEntryEditorComponent.Event.AssignButtonClicked',
}

interface InventoryOrderItemEntryFormModel extends FormGroup<{
  product: FormControl<string>;
  location: FormControl<string>;
  quantity: FormControl<number>;
}> { }

@Component({
  selector: 'emp-trade-inventory-order-item-entry-editor',
  templateUrl: './inventory-order-item-entry-editor.component.html',
})
export class InventoryOrderItemEntryEditorComponent implements OnChanges {

  @Input() orderUID = '';

  @Input() itemUID = '';

  @Input() assignedQuantity = 0;

  @Output() inventoryOrderItemEntryEditorEvent = new EventEmitter<EventInfo>();

  form: InventoryOrderItemEntryFormModel;

  formHelper = FormHelper;


  constructor() {
    this.initForm();
  }


  ngOnChanges() {
    this.resetFormData();
  }


  onAssignOrderItemEntryClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        orderUID: this.orderUID,
        itemUID: this.itemUID,
        dataFields: this.getFormData()
      };

      sendEvent(this.inventoryOrderItemEntryEditorEvent,
        InventoryOrderItemEntryEditorEventType.ASSIGN_BUTTON_CLICKED, payload);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      product: ['', Validators.required],
      location: ['', Validators.required],
      quantity: [null as number, Validators.required],
    });
  }


  private resetFormData() {
    this.form.reset();
  }


  private getFormData(): OrderItemEntry {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: OrderItemEntry = {
      uid: null,
      product: formModel.product,
      location: formModel.location,
      quantity: formModel.quantity,
    };

    return data;
  }

}
