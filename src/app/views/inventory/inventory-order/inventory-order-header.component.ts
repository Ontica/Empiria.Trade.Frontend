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

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { ContactsDataService } from '@app/data-services';

import { EmptyInventoryPicking, InventoryOrderFields, InventoryPicking } from '@app/models';


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
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-inventory-order-header',
  templateUrl: './inventory-order-header.component.html',
})
export class InventoryOrderHeaderComponent implements OnChanges, OnInit, OnDestroy {

  @Input() isSaved = false;

  @Input() canEdit = false;

  @Input() canClose = false;

  @Input() canDelete = false;

  @Input() order: InventoryPicking = EmptyInventoryPicking;

  @Output() inventoryOrderHeaderEvent = new EventEmitter<EventInfo>();

  form: InventoryOrderFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  inventoryTypesList: Identifiable[] = [];

  responsableList: Identifiable[] = [];

  warehousemenList: Identifiable[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private contactsData: ContactsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.order && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.canEdit || this.canClose;
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

    this.formHelper.setDisableForm(this.form, !this.editionMode);
    FormHelper.setDisableControl(this.form.controls.inventoryOrderNo);
    FormHelper.setDisableControl(this.form.controls.inventoryOrderType, this.isSaved);
    FormHelper.setDisableControl(this.form.controls.responsibleUID, this.responsableList.length === 1);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.INVENTORY_ORDER_TYPES),
      this.contactsData.getWarehousemen(),
      this.contactsData.getSupervisors()
    ])
    .subscribe(([x, y, z]) => {
      this.inventoryTypesList = x;
      this.warehousemenList = y;
      this.setResponsableData(z);
      this.isLoading = false;
    });
  }


  private setResponsableData(data: Identifiable[]) {
    this.responsableList = data;
    this.validateResponsableInList();
    this.validateResponsableDefault();
    this.validateResponsableDisabled();
  }


  private validateResponsableInList() {
    this.responsableList = isEmpty(this.order.responsible) ? this.responsableList :
      ArrayLibrary.insertIfNotExist(this.responsableList ?? [], this.order.responsible, 'uid');
  }


  private validateResponsableDefault() {
    const responsableDefault = ArrayLibrary.getFirstItem(this.responsableList);
    const responsable = isEmpty(this.order.responsible) ? responsableDefault : this.order.responsible;
    this.form.controls.responsibleUID.reset(responsable?.uid ?? null);
  }


  private validateResponsableDisabled() {
    const inEdition = !this.isSaved || (this.isSaved && this.editionMode)
    const hasOptions = this.responsableList.length > 1;
    const enable = inEdition && hasOptions;
    FormHelper.setDisableControl(this.form.controls.responsibleUID, !enable);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      inventoryOrderType: ['', Validators.required],
      inventoryOrderNo: ['', Validators.required],
      responsibleUID: ['', Validators.required],
      assignedToUID: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      inventoryOrderType: isEmpty(this.order.inventoryOrderType) ? null : this.order.inventoryOrderType.uid,
      inventoryOrderNo: this.order.inventoryOrderNo ?? null,
      responsibleUID: isEmpty(this.order.responsible) ? null : this.order.responsible.uid,
      assignedToUID: isEmpty(this.order.assignedTo) ? null : this.order.assignedTo.uid,
      notes: this.order.notes,
    });

    this.validateResponsableInList();
    this.validateResponsableDefault();
  }


  private getFormData(): InventoryOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: InventoryOrderFields = {
      inventoryOrderTypeUID: formModel.inventoryOrderType ?? '',
      responsibleUID: formModel.responsibleUID ?? '',
      assignedToUID: formModel.assignedToUID ?? '',
      notes: formModel.notes ?? '',
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
                <strong> ${this.order.inventoryOrderType.name}:
                ${this.order.inventoryOrderNo}</strong>.
                <br><br>¿Elimino la orden de inventario?`;

      case InventoryOrderHeaderEventType.CLOSE_ORDER:
        return `Esta operación aplicará la orden de inventario
                <strong> ${this.order.inventoryOrderType.name}:
                ${this.order.inventoryOrderNo}</strong>.
                <br><br>¿Aplico la orden de inventario?`;

      default: return '';
    }
  }

}
