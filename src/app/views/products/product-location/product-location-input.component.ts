/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output,
         ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { ProductLocationFields } from '@app/models';


export enum ProductLocationInputEventType {
  ADD_BUTTON_CLICKED = 'ProductLocationInputComponent.Event.AddButtonClicked',
}

interface ProductLocationInputFormModel extends FormGroup<{
  product: FormControl<string>;
  location: FormControl<string>;
  quantity: FormControl<number>;
}> { }

@Component({
  selector: 'emp-trade-product-location-input',
  templateUrl: './product-location-input.component.html',
})
export class ProductLocationInputComponent implements OnChanges, AfterViewInit {

  @ViewChild('productInput') productInput!: ElementRef<HTMLInputElement>;

  @Input() orderUID = '';

  @Input() itemUID = '';

  @Input() assignedQuantity = null;

  @Output() productLocationInputEvent = new EventEmitter<EventInfo>();

  form: ProductLocationInputFormModel;

  formHelper = FormHelper;


  constructor() {
    this.initForm();
  }


  ngOnChanges() {
    this.resetFormData();
  }


  ngAfterViewInit() {
    this.initFormFocus();
  }


  onFocusNext(next: any) {
    if (next?.nativeElement?.focus) {
      next.nativeElement.focus();
    } else if (next?.focus) {
      next.focus();
    }
  }


  onAddButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        orderUID: this.orderUID,
        itemUID: this.itemUID,
        dataFields: this.getFormData()
      };

      sendEvent(this.productLocationInputEvent, ProductLocationInputEventType.ADD_BUTTON_CLICKED, payload);
    }

    this.initFormFocus();
  }


  private initFormFocus() {
    setTimeout(() => this.productInput.nativeElement.focus());
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


  private getFormData(): ProductLocationFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ProductLocationFields = {
      product: formModel.product,
      location: formModel.location,
      quantity: formModel.quantity,
    };

    return data;
  }

}
