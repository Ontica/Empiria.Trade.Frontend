/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EventInfo} from '@app/core';

import { EmptyOrder, Order, OrderAdditionalData } from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';

export enum OrderAdditionalDataEventType {
  CHANGE_DATA = 'OrderAdditionalDataComponent.Event.ChangeData',
}

interface OrderAdditionalDataFormModel extends FormGroup<{
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-order-additional-data',
  templateUrl: './order-additional-data.component.html',
})
export class OrderAdditionalDataComponent implements OnChanges {

  @Input() order: Order = EmptyOrder();

  @Input() editionMode = false;

  @Input() isSaved = false;

  @Output() orderAdditionalDataEvent = new EventEmitter<EventInfo>();

  form: OrderAdditionalDataFormModel;

  formHelper = FormHelper;

  isChangeEmission = false;


  constructor() {
    this.initForm();
    this.validateEditionMode();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.order) {
      this.setFormData();
    }

    if (changes.editionMode) {
      this.validateEditionMode();
    }
  }


  invalidateForm() {
    this.formHelper.markFormControlsAsTouched(this.form);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({ notes: [''] });

    this.form.valueChanges.subscribe(v => this.emitFormChanges());
  }


  private emitFormChanges() {
    if (this.isChangeEmission) {
      this.isChangeEmission = false;
    } else {

      const payload = {
        isFormValid: this.form.valid,
        isFormDirty: this.form.dirty,
        orderAdditionalData: this.getFormData(),
      };

      this.isChangeEmission = true;

      sendEvent(this.orderAdditionalDataEvent, OrderAdditionalDataEventType.CHANGE_DATA, payload);
    }
  }


  private setFormData() {
    if (this.isSaved) {
      this.form.reset({notes: this.order.notes});
    } else {
      this.isChangeEmission = false;
    }
  }


  private validateEditionMode() {
    this.setFormData();
    setTimeout(() => this.formHelper.setDisableForm(this.form, !this.editionMode));
  }


  private getFormData(): OrderAdditionalData {
    const formModel = this.form.getRawValue();
    const data: OrderAdditionalData = { notes: formModel.notes ?? '' };
    return data;
  }

}
