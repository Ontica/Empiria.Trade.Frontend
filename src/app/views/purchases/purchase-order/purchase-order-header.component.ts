/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { SearcherAPIS } from '@app/data-services';

import { EmptyPurchaseOrder, PaymentConditionsList, PurchaseOrder, PurchaseOrderFields,
         ReceptionMethodList } from '@app/models';


export enum PurchaseOrderHeaderEventType {
  CREATE_ORDER = 'PurchaseOrderHeaderComponent.Event.CreateOrder',
  UPDATE_ORDER = 'PurchaseOrderHeaderComponent.Event.UpdateOrder',
  DELETE_ORDER = 'PurchaseOrderHeaderComponent.Event.DeleteOrder',
  CLOSE_ORDER  = 'PurchaseOrderHeaderComponent.Event.CloseOrder',
  EXPORT_ORDER = 'PurchaseOrderHeaderComponent.Event.ExportOrder',
}


interface PurchaseOrderFormModel extends FormGroup<{
  supplierUID: FormControl<string>;
  paymentConditions: FormControl<string>;
  shippingMethod: FormControl<string>;
  currencyUID: FormControl<string>;
  scheduledTime: FormControl<DateString>;
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-purchase-order-header',
  templateUrl: './purchase-order-header.component.html',
})
export class PurchaseOrderHeaderComponent implements OnChanges, OnInit, OnDestroy {

  @Input() isSaved = false;

  @Input() order: PurchaseOrder = EmptyPurchaseOrder;

  @Output() purchaseOrderHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PurchaseOrderFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  suppliersAPI = SearcherAPIS.suppliers;

  receptionMethodList: Identifiable[] = ReceptionMethodList;

  paymentConditionsList: Identifiable[] = PaymentConditionsList;

  currenciesList: Identifiable[] = [];


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.order && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.order.actions.canEdit || this.order.actions.canClose || this.order.actions.canExport ||
           this.order.actions.canDelete;
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


  onExportButtonClicked() {
    sendEvent(this.purchaseOrderHeaderEvent, PurchaseOrderHeaderEventType.EXPORT_ORDER);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES)
      .subscribe(x => {
        this.currenciesList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      supplierUID: ['', Validators.required],
      paymentConditions: [''],
      shippingMethod: [''],
      currencyUID: [''],
      scheduledTime: ['' as DateString],
      notes: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        supplierUID: isEmpty(this.order.supplier) ? '' : this.order.supplier.uid,
        paymentConditions: this.order.paymentConditions,
        shippingMethod: this.order.shippingMethod,
        currencyUID: isEmpty(this.order.currency) ? '' : this.order.currency.uid,
        scheduledTime: this.order.scheduledTime,
        notes: this.order.notes,
      });
    });
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.order.actions.canEdit);
      FormHelper.setDisableForm(this.form, disable);
    });
  }


  private getFormData(): PurchaseOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: PurchaseOrderFields = {
      supplierUID: formModel.supplierUID ?? '',
      paymentConditions: formModel.paymentConditions ?? '',
      shippingMethod: formModel.shippingMethod ?? '',
      currencyUID: formModel.currencyUID ?? '',
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
      .then(x => sendEventIf(x, this.purchaseOrderHeaderEvent, eventType));
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
