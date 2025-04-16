/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { ShippingDataService } from '@app/data-services';

import { EmptyShippingData, ShippingData, ShippingDataFields } from '@app/models';


export enum ShippingDataViewEventType {
  CHANGE_DATA = 'ShippingDataViewComponent.Event.ChangeData',
}

interface ShippingFormModel extends FormGroup<{
  parcelSupplier: FormControl<string>;
  shippingGuide: FormControl<string>;
  parcelAmount: FormControl<number>;
  customerAmount: FormControl<number>;
}> { }

@Component({
  selector: 'emp-trade-shipping-data-view',
  templateUrl: './shipping-data-view.component.html',
})
export class ShippingDataViewComponent implements OnChanges, OnInit {

  @Input() shippingData: ShippingData = EmptyShippingData;

  @Input() editionMode = false;

  @Output() shippingDataViewEvent = new EventEmitter<EventInfo>();

  form: ShippingFormModel;

  formHelper = FormHelper;

  isLoading = false;

  showAuthorizeButton = false;

  parcelSuppliersList: Identifiable[] = [];


  constructor(private shippingDataService: ShippingDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.editionMode || (changes.shippingData && !this.form.dirty)) {
      this.setFormData();
    }
  }


  ngOnInit() {
    this.loadDataList();
  }


  onAuthorizeNotChargingShipping() {
    this.messageBox.showInDevelopment('Solicitar autorización de no cobrar flete.');
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
      parcelSupplier: ['', Validators.required],
      shippingGuide: ['', Validators.required],
      parcelAmount: [null as number, Validators.required],
      customerAmount: [null as number, Validators.required],
    });

    this.showAuthorizeButton = true;

    this.form.valueChanges.subscribe(v => this.emitFormChanges());
  }


  private emitFormChanges() {
    const payload = {
      isFormReady: FormHelper.isFormReady(this.form),
      isFormDirty: this.form.dirty,
      shippingDataFields: this.getFormData(),
    };

    sendEvent(this.shippingDataViewEvent, ShippingDataViewEventType.CHANGE_DATA, payload);
  }


  private setFormData() {
    this.form.reset({
      parcelSupplier: this.shippingData.parcelSupplier.uid,
      shippingGuide: this.shippingData.shippingGuide,
      parcelAmount: this.validateEmptyAmount(this.shippingData.parcelAmount),
      customerAmount: this.validateEmptyAmount(this.shippingData.customerAmount),
    });

    this.formHelper.setDisableForm(this.form, !this.editionMode);

    this.showAuthorizeButton = this.editionMode;
  }


  private validateEmptyAmount(amount: number): number {
    if (isEmpty(this.shippingData.parcelSupplier) && !amount) {
      return null;
    }

    return amount;
  }


  private getFormData(): ShippingDataFields {
    const formModel = this.form.getRawValue();

    const data: ShippingDataFields = {
      shippingUID: this.shippingData.shippingUID ?? '',
      parcelSupplierUID: formModel.parcelSupplier ?? '',
      shippingGuide: formModel.shippingGuide ?? '',
      parcelAmount: formModel.parcelAmount ?? null,
      customerAmount: formModel.customerAmount ?? null,
    };

    return data;
  }

}
