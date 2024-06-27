/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EventInfo} from '@app/core';

import { EmptySaleOrderAdditionalData, SaleOrderAdditionalData } from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';

export enum SaleOrderAdditionalDataEventType {
  CHANGE_DATA = 'SaleOrderAdditionalDataComponent.Event.ChangeData',
}

interface SaleOrderAdditionalDataFormModel extends FormGroup<{
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-sale-order-additional-data',
  templateUrl: './sale-order-additional-data.component.html',
})
export class SaleOrderAdditionalDataComponent implements OnChanges {

  @Input() orderData: SaleOrderAdditionalData = EmptySaleOrderAdditionalData;

  @Input() editionMode = false;

  @Input() isSaved = false;

  @Output() saleOrderAdditionalDataEvent = new EventEmitter<EventInfo>();

  form: SaleOrderAdditionalDataFormModel;

  formHelper = FormHelper;

  isChangeEmission = false;


  constructor() {
    this.initForm();
    this.validateEditionMode();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderData) {
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
        data: this.getFormData(),
      };

      this.isChangeEmission = true;

      sendEvent(this.saleOrderAdditionalDataEvent, SaleOrderAdditionalDataEventType.CHANGE_DATA, payload);
    }
  }


  private setFormData() {
    if (this.isSaved) {
      this.form.reset({ notes: this.orderData.notes});
    } else {
      this.isChangeEmission = false;
    }
  }


  private validateEditionMode() {
    this.setFormData();
    setTimeout(() => this.formHelper.setDisableForm(this.form, !this.editionMode));
  }


  private getFormData(): SaleOrderAdditionalData {
    const formModel = this.form.getRawValue();
    const data: SaleOrderAdditionalData = { notes: formModel.notes ?? '' };
    return data;
  }

}
