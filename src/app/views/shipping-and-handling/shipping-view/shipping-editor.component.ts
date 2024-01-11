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

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { ShippingDataService } from '@app/data-services';

import { EmptyShipping, Shipping, ShippingFields } from '@app/models';


export enum ShippingEditorEventType {
  UPDATE_SHIPPING_CLICKED = 'ShippingEditorComponent.Event.UpdateShippingClicked',
  SEND_ORDER_CLICKED      = 'ShippingEditorComponent.Event.SendOrderClicked',
}

interface ShippingFormModel extends FormGroup<{
  parcelSupplier: FormControl<string>;
  shippingGuide: FormControl<string>;
  parcelAmount: FormControl<number>;
  customerAmount: FormControl<number>;
}> { }

@Component({
  selector: 'emp-trade-shipping-editor',
  templateUrl: './shipping-editor.component.html',
})
export class ShippingEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() orderUID: string = '';

  @Input() orderNumber: string = '';

  @Input() shipping: Shipping = EmptyShipping;

  @Input() canEdit = false;

  // @Input() canSendOrder = false;

  @Output() shippingEditorEvent = new EventEmitter<EventInfo>();

  form: ShippingFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  parcelSuppliersList: Identifiable[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private shippingData: ShippingDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges() {
    this.enableEditor(false);
  }


  ngOnInit() {
    this.loadDataList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get canSendOrder(): boolean {
    return this.canEdit && !isEmpty(this.shipping.parcelSupplier);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    const disable = !this.editionMode;

    this.formHelper.setDisableForm(this.form, disable);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        orderUID: this.orderUID,
        shipping: this.getFormData(),
      };

      sendEvent(this.shippingEditorEvent, ShippingEditorEventType.UPDATE_SHIPPING_CLICKED, payload);
    }
  }


  onSendOrder() {
    this.confirmSendOrder();
  }


  private loadDataList() {
    this.isLoading = true;

    this.shippingData.getParcelSuppliers()
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
  }


  private setFormData() {
    this.form.reset({
      parcelSupplier: this.shipping.parcelSupplier.uid,
      shippingGuide: this.shipping.shippingGuide,
      parcelAmount: this.validateEmptyAmount(this.shipping.parcelAmount),
      customerAmount: this.validateEmptyAmount(this.shipping.customerAmount),
    });
  }


  private validateEmptyAmount(amount: number): number {
    if (isEmpty(this.shipping.parcelSupplier) && !amount) {
      return null;
    }

    return amount;
  }


  private getFormData(): ShippingFields {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ShippingFields = {
      orderUID: this.orderUID,
      parcelSupplierUID: formModel.parcelSupplier ?? '',
      shippingGuide: formModel.shippingGuide ?? '',
      parcelAmount: formModel.parcelAmount ?? null,
      customerAmount: formModel.customerAmount ?? null,
    };

    return data;
  }


  private confirmSendOrder() {
    const message = `Esta operación enviará el pedido <strong> ${this.orderNumber} </strong> ` +
      `con la paquetería <strong> ${this.shipping.parcelSupplier.name} </strong>. <br><br>¿Envío el pedido?`;

    this.messageBox.confirm(message, 'Enviar pedido')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.shippingEditorEvent, ShippingEditorEventType.SEND_ORDER_CLICKED);
        }
      });
  }

}
