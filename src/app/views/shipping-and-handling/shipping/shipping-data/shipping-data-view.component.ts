/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ShippingDataService } from '@app/data-services';

import { EmptyShippingData, ShippingData, ShippingDataFields } from '@app/models';

export enum ShippingDataViewEventType {
  SAVE_SHIPPING_CLICKED = 'ShippingDataViewComponent.Event.SaveShippingClicked',
  SEND_ORDER_CLICKED      = 'ShippingDataViewComponent.Event.SendOrderClicked',
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
export class ShippingDataViewComponent implements OnChanges, OnInit, OnDestroy {

  @Input() shippingData: ShippingData = EmptyShippingData;

  @Input() canEdit = false;

  @Input() putOnPallets: boolean = false; // put packages on pallets || palletizing packages || palletizePackages

  @Output() putOnPalletsChange = new EventEmitter<boolean>();

  @Output() shippingDataViewEvent = new EventEmitter<EventInfo>();

  form: ShippingFormModel;

  formHelper = FormHelper;

  isLoading = false;

  parcelSuppliersList: Identifiable[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private shippingDataService: ShippingDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges() {
    this.setFormData();
  }


  ngOnInit() {
    this.loadDataList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get canSendOrder(): boolean {
    return this.canEdit && !isEmpty(this.shippingData.parcelSupplier);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        shippingData: this.getFormData(),
      };

      sendEvent(this.shippingDataViewEvent, ShippingDataViewEventType.SAVE_SHIPPING_CLICKED, payload);
    }
  }


  onSendOrder() {
    this.confirmSendOrder();
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
      customerAmount: [null as number],
    });
  }


  private setFormData() {
    this.form.reset({
      parcelSupplier: this.shippingData.parcelSupplier.uid,
      shippingGuide: this.shippingData.shippingGuide,
      parcelAmount: this.validateEmptyAmount(this.shippingData.parcelAmount),
      customerAmount: this.validateEmptyAmount(this.shippingData.customerAmount),
    });

    this.formHelper.setDisableForm(this.form, !this.canEdit);
  }


  private validateEmptyAmount(amount: number): number {
    if (isEmpty(this.shippingData.parcelSupplier) && !amount) {
      return null;
    }

    return amount;
  }


  private getFormData(): ShippingDataFields {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ShippingDataFields = {
      parcelSupplierUID: formModel.parcelSupplier ?? '',
      shippingGuide: formModel.shippingGuide ?? '',
      parcelAmount: formModel.parcelAmount ?? null,
      customerAmount: formModel.customerAmount ?? null,
    };

    return data;
  }


  private confirmSendOrder() {
    const message = `Esta operación pasará a embarque los pedidos seleccionados para su envío con la ` +
      `paquetería <strong> ${this.shippingData.parcelSupplier.name} </strong>. <br><br>¿Envío el pedido?`;

    this.messageBox.confirm(message, 'Enviar a embarque')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.shippingDataViewEvent, ShippingDataViewEventType.SEND_ORDER_CLICKED);
        }
      });
  }

}
