/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { InventaryStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { EmptyInventoryOrder, InventoryOrder, InventoryOrderFields } from '@app/models';


export enum InventoryOrderHeaderEventType {
  CREATE = 'InventoryOrderHeaderComponent.Event.CreateOrder',
  UPDATE = 'InventoryOrderHeaderComponent.Event.UpdateOrder',
  DELETE = 'InventoryOrderHeaderComponent.Event.DeleteOrder',
  CLOSE  = 'InventoryOrderHeaderComponent.Event.CloseOrder',
}


interface InventoryOrderFormModel extends FormGroup<{
  inventoryTypeUID: FormControl<string>;
  warehouseUID: FormControl<string>;
  responsibleUID: FormControl<string>;
  requestedByUID: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-inventory-order-header',
  templateUrl: './inventory-order-header.component.html',
})
export class InventoryOrderHeaderComponent implements OnChanges, OnInit, OnDestroy {

  @Input() isSaved = false;

  @Input() order: InventoryOrder = EmptyInventoryOrder;

  @Input() canUpdate = false;

  @Input() canClose = false;

  @Input() canDelete = false;

  @Output() inventoryOrderHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: InventoryOrderFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  inventoryTypesList: Identifiable[] = [];

  warehousesList: Identifiable[] = [];

  warehousemenList: Identifiable[] = [];

  supervisorsList: Identifiable[] = [];


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
    return this.canUpdate || this.canClose || this.canDelete;
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = InventoryOrderHeaderEventType.CREATE;

      if (this.isSaved) {
        eventType = InventoryOrderHeaderEventType.UPDATE;
      }

      sendEvent(this.inventoryOrderHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(InventoryOrderHeaderEventType.DELETE);
  }


  onCloseButtonClicked() {
    this.showConfirmMessage(InventoryOrderHeaderEventType.CLOSE);
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

    combineLatest([
      this.helper.select<Identifiable[]>(InventaryStateSelector.INVENTORY_TYPES),
      this.helper.select<Identifiable[]>(InventaryStateSelector.WAREHOUSES),
      this.helper.select<Identifiable[]>(InventaryStateSelector.WAREHOUSEMEN),
      this.helper.select<Identifiable[]>(InventaryStateSelector.SUPERVISORS),
    ])
    .subscribe(([a, b, c, d]) => {
      this.inventoryTypesList = a;
      this.warehousesList = b;
      this.warehousemenList = c;
      this.supervisorsList = d;
      this.initLists();
      this.isLoading = a.length === 0;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      inventoryTypeUID: ['', Validators.required],
      warehouseUID: ['', Validators.required],
      responsibleUID: ['', Validators.required],
      requestedByUID: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      inventoryTypeUID: isEmpty(this.order.inventoryType) ? null : this.order.inventoryType.uid,
      warehouseUID: isEmpty(this.order.warehouse) ? null : this.order.warehouse.uid,
      responsibleUID: isEmpty(this.order.responsible) ? null : this.order.responsible.uid,
      requestedByUID: isEmpty(this.order.requestedBy) ? null : this.order.requestedBy.uid,
      description: this.order.description,
    });

    this.initLists();
  }


  private validateFormDisabled() {
    const disable = this.isSaved && (!this.editionMode || !this.canUpdate);
    FormHelper.setDisableForm(this.form, disable);
    FormHelper.setDisableControl(this.form.controls.inventoryTypeUID, this.isSaved);
  }


  private initLists() {
    this.inventoryTypesList =
      ArrayLibrary.insertIfNotExist(this.inventoryTypesList ?? [], this.order.inventoryType, 'uid');
    this.warehousemenList =
      ArrayLibrary.insertIfNotExist(this.warehousemenList ?? [], this.order.responsible, 'uid');
    this.supervisorsList =
      ArrayLibrary.insertIfNotExist(this.supervisorsList ?? [], this.order.requestedBy, 'uid');
  }


  private getFormData(): InventoryOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: InventoryOrderFields = {
      inventoryTypeUID: formModel.inventoryTypeUID ?? '',
      warehouseUID: formModel.warehouseUID ?? '',
      responsibleUID: formModel.responsibleUID ?? '',
      requestedByUID: formModel.requestedByUID ?? '',
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
      case InventoryOrderHeaderEventType.DELETE: return 'DeleteCancel';
      case InventoryOrderHeaderEventType.CLOSE:  return 'AcceptCancel';
      default: return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: InventoryOrderHeaderEventType): string {
    switch (eventType) {
      case InventoryOrderHeaderEventType.DELETE: return 'Eliminar orden de inventario';
      case InventoryOrderHeaderEventType.CLOSE:  return 'Aplicar orden de inventario';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: InventoryOrderHeaderEventType): string {
    switch (eventType) {
      case InventoryOrderHeaderEventType.DELETE:
        return `Esta operación eliminará la orden de inventario
                <strong> ${this.order.inventoryType.name}:
                ${this.order.orderNo}</strong>.
                <br><br>¿Elimino la orden de inventario?`;

      case InventoryOrderHeaderEventType.CLOSE:
        return `Esta operación aplicará la orden de inventario
                <strong> ${this.order.inventoryType.name}:
                ${this.order.orderNo}</strong>.
                <br><br>¿Aplico la orden de inventario?`;

      default: return '';
    }
  }

}
