/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { SearcherAPIS } from '@app/data-services';

import { EmptyPurchaseOrder, PaymentConditionList, PurchaseOrder, PurchaseOrderFields,
         ReceptionMethodList } from '@app/models';


export enum PurchaseOrderHeaderEventType {
  CREATE_ORDER = 'PurchaseOrderHeaderComponent.Event.CreateOrder',
  UPDATE_ORDER = 'PurchaseOrderHeaderComponent.Event.UpdateOrder',
  DELETE_ORDER = 'PurchaseOrderHeaderComponent.Event.DeleteOrder',
  CLOSE_ORDER  = 'PurchaseOrderHeaderComponent.Event.CloseOrder',
}


interface PurchaseOrderFormModel extends FormGroup<{
  supplierUID: FormControl<string>;
  paymentCondition: FormControl<string>;
  shippingMethod: FormControl<string>;
  scheduledTime: FormControl<DateString>;
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-purchase-order-header',
  templateUrl: './purchase-order-header.component.html',
})
export class PurchaseOrderHeaderComponent implements OnChanges {

  @Input() isSaved = false;

  @Input() canEdit = false;

  @Input() canClose = false;

  @Input() canDelete = false;

  @Input() order: PurchaseOrder = EmptyPurchaseOrder;

  @Output() purchaseOrderHeaderEvent = new EventEmitter<EventInfo>();

  form: PurchaseOrderFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  suppliersAPI = SearcherAPIS.suppliers;

  receptionMethodList: Identifiable[] = ReceptionMethodList;

  paymentConditionList: Identifiable[] = PaymentConditionList;


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.order && this.isSaved) {
      this.enableEditor(false);
    }
  }


  get hasActions(): boolean {
    return this.canEdit || this.canClose;
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = PurchaseOrderHeaderEventType.CREATE_ORDER;

      if (this.isSaved) {
        eventType = PurchaseOrderHeaderEventType.UPDATE_ORDER;
      }

      sendEvent(this.purchaseOrderHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(PurchaseOrderHeaderEventType.DELETE_ORDER);
  }


  onCloseButtonClicked() {
    this.showConfirmMessage(PurchaseOrderHeaderEventType.CLOSE_ORDER);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHelper.setDisableForm(this.form, !this.editionMode);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      supplierUID: ['', Validators.required],
      paymentCondition: [''],
      shippingMethod: [''],
      scheduledTime: ['' as DateString],
      notes: [''],
    });
  }


  private setFormData() {
    this.form.reset({
      supplierUID: isEmpty(this.order.supplier) ? '' : this.order.supplier.uid,
      paymentCondition: this.order.paymentCondition,
      shippingMethod: this.order.shippingMethod,
      scheduledTime: this.order.scheduledTime,
      notes: this.order.notes,
    });
  }


  private getFormData(): PurchaseOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: PurchaseOrderFields = {
      supplierUID: formModel.supplierUID ?? '',
      paymentCondition: formModel.paymentCondition ?? '',
      shippingMethod: formModel.shippingMethod ?? '',
      scheduledTime: formModel.scheduledTime ?? '',
      notes: formModel.notes ?? '',
    };

    return data;
  }


  private showConfirmMessage(eventType: PurchaseOrderHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.purchaseOrderHeaderEvent, eventType);
        }
      });
  }


  private getConfirmType(eventType: PurchaseOrderHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case PurchaseOrderHeaderEventType.DELETE_ORDER: return 'DeleteCancel';
      case PurchaseOrderHeaderEventType.CLOSE_ORDER: return 'AcceptCancel';
      default: return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: PurchaseOrderHeaderEventType): string {
    switch (eventType) {
      case PurchaseOrderHeaderEventType.DELETE_ORDER: return 'Eliminar orden de compra';
      case PurchaseOrderHeaderEventType.CLOSE_ORDER: return 'Aplicar orden de compra';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: PurchaseOrderHeaderEventType): string {
    switch (eventType) {
      case PurchaseOrderHeaderEventType.DELETE_ORDER:
        return `Esta operación eliminará la orden de compra
                <strong> ${this.order.orderNumber}:
                ${this.order.supplier.name}</strong>.
                <br><br>¿Elimino la orden de compra?`;

      case PurchaseOrderHeaderEventType.CLOSE_ORDER:
        return `Esta operación cerrará la orden de compra
                <strong> ${this.order.orderNumber}:
                ${this.order.supplier.name}</strong>.
                <br><br>¿Cierro la orden de compra?`;

      default: return '';
    }
  }

}
