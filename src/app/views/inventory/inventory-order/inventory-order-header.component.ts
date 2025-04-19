/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { EmptyOrder, InventoryOrderFields, Order } from '@app/models';


export enum InventoryOrderHeaderEventType {
  CREATE_ORDER = 'InventoryOrderHeaderComponent.Event.CreateOrder',
  UPDATE_ORDER = 'InventoryOrderHeaderComponent.Event.UpdateOrder',
  DELETE_ORDER = 'InventoryOrderHeaderComponent.Event.DeleteOrder',
  CLOSE_ORDER  = 'InventoryOrderHeaderComponent.Event.CloseOrder',
}


interface InventoryOrderFormModel extends FormGroup<{
  inventoryOrderType: FormControl<string>;
  inventoryOrderNo: FormControl<string>;
  responsibleUID: FormControl<string>;
  assignedToUID: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-inventory-order-header',
  templateUrl: './inventory-order-header.component.html',
})
export class InventoryOrderHeaderComponent implements OnChanges {

  @Input() isSaved = false;

  @Input() canUpdate = false;

  @Input() canClose = false;

  @Input() canDelete = false;

  @Input() order: Order = EmptyOrder;

  @Output() inventoryOrderHeaderEvent = new EventEmitter<EventInfo>();

  form: InventoryOrderFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  inventoryTypesList: Identifiable[] = [];

  responsibleList: Identifiable[] = [];

  warehousemenList: Identifiable[] = [];


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
    return this.canUpdate || this.canClose || this.canDelete;
  }


  get selectionPlaceholder(): string {
    return this.isSaved && !this.canUpdate ? 'No proporcionado' : 'Seleccionar';
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = InventoryOrderHeaderEventType.CREATE_ORDER;

      if (this.isSaved) {
        eventType = InventoryOrderHeaderEventType.UPDATE_ORDER;
      }

      sendEvent(this.inventoryOrderHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(InventoryOrderHeaderEventType.DELETE_ORDER);
  }


  onCloseButtonClicked() {
    this.showConfirmMessage(InventoryOrderHeaderEventType.CLOSE_ORDER);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      inventoryOrderType: ['', Validators.required],
      inventoryOrderNo: ['', Validators.required],
      responsibleUID: ['', Validators.required],
      assignedToUID: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      inventoryOrderType: isEmpty(this.order.orderType) ? null : this.order.orderType.uid,
      inventoryOrderNo: this.order.orderNo ?? null,
      responsibleUID: isEmpty(this.order.responsible) ? null : this.order.responsible.uid,
      description: this.order.description,
    });

    this.initLists();
  }


  private validateFormDisabled() {
    const disable = this.isSaved && (!this.editionMode || !this.canUpdate);
    FormHelper.setDisableForm(this.form, disable);
    FormHelper.setDisableControl(this.form.controls.inventoryOrderNo, this.isSaved);
    FormHelper.setDisableControl(this.form.controls.inventoryOrderType, this.isSaved);
  }


  private initLists() {
    this.inventoryTypesList = isEmpty(this.order.orderType) ? this.inventoryTypesList :
      ArrayLibrary.insertIfNotExist(this.inventoryTypesList ?? [], this.order.orderType, 'uid');
    this.responsibleList = isEmpty(this.order.responsible) ? this.responsibleList :
      ArrayLibrary.insertIfNotExist(this.responsibleList ?? [], this.order.responsible, 'uid');
  }


  private getFormData(): InventoryOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: InventoryOrderFields = {
      inventoryOrderTypeUID: formModel.inventoryOrderType ?? '',
      responsibleUID: formModel.responsibleUID ?? '',
      assignedToUID: formModel.assignedToUID ?? '',
      description: formModel.description ?? '',
    };

    return data;
  }


  private showConfirmMessage(eventType: InventoryOrderHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.inventoryOrderHeaderEvent, eventType);
        }
      });
  }


  private getConfirmType(eventType: InventoryOrderHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case InventoryOrderHeaderEventType.DELETE_ORDER: return 'DeleteCancel';
      case InventoryOrderHeaderEventType.CLOSE_ORDER:  return 'AcceptCancel';
      default: return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: InventoryOrderHeaderEventType): string {
    switch (eventType) {
      case InventoryOrderHeaderEventType.DELETE_ORDER: return 'Eliminar orden de inventario';
      case InventoryOrderHeaderEventType.CLOSE_ORDER:  return 'Aplicar orden de inventario';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: InventoryOrderHeaderEventType): string {
    switch (eventType) {
      case InventoryOrderHeaderEventType.DELETE_ORDER:
        return `Esta operación eliminará la orden de inventario
                <strong> ${this.order.orderType.name}:
                ${this.order.orderNo}</strong>.
                <br><br>¿Elimino la orden de inventario?`;

      case InventoryOrderHeaderEventType.CLOSE_ORDER:
        return `Esta operación aplicará la orden de inventario
                <strong> ${this.order.orderType.name}:
                ${this.order.orderNo}</strong>.
                <br><br>¿Aplico la orden de inventario?`;

      default: return '';
    }
  }

}
