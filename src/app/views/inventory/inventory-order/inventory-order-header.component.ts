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

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { ContactsDataService } from '@app/data-services';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyInventoryPicking, InventoryOrderFields, InventoryPicking } from '@app/models';


export enum InventoryOrderHeaderEventType {
  CREATE_INVENTORY_ORDER = 'InventoryOrderHeaderComponent.Event.CreateInventoryOrder',
  UPDATE_INVENTORY_ORDER = 'InventoryOrderHeaderComponent.Event.UpdateInventoryOrder',
  DELETE_INVENTORY_ORDER = 'InventoryOrderHeaderComponent.Event.DeleteInventoryOrder',
  CLOSE_INVENTORY_ORDER  = 'InventoryOrderHeaderComponent.Event.CloseInventoryOrder',
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

  @Input() inventoryOrder: InventoryPicking = EmptyInventoryPicking;

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
    if (changes.inventoryOrder && this.isSaved) {
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
      let eventType = InventoryOrderHeaderEventType.CREATE_INVENTORY_ORDER;

      if (this.isSaved) {
        eventType = InventoryOrderHeaderEventType.UPDATE_INVENTORY_ORDER;
      }

      sendEvent(this.inventoryOrderHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(InventoryOrderHeaderEventType.DELETE_INVENTORY_ORDER);
  }


  onCloseButtonClicked() {
    this.showConfirmMessage(InventoryOrderHeaderEventType.CLOSE_INVENTORY_ORDER);
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
    this.responsableList = isEmpty(this.inventoryOrder.responsible) ? this.responsableList :
      ArrayLibrary.insertIfNotExist(this.responsableList ?? [], this.inventoryOrder.responsible, 'uid');
  }


  private validateResponsableDefault() {
    const responsableDefault = ArrayLibrary.getFirstItem(this.responsableList);

    const responsable = isEmpty(this.inventoryOrder.responsible) ?
      responsableDefault : this.inventoryOrder.responsible;

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
      inventoryOrderType: isEmpty(this.inventoryOrder.inventoryOrderType) ? null : this.inventoryOrder.inventoryOrderType.uid,
      inventoryOrderNo: this.inventoryOrder.inventoryOrderNo ?? null,
      responsibleUID: isEmpty(this.inventoryOrder.responsible) ? null : this.inventoryOrder.responsible.uid,
      assignedToUID: isEmpty(this.inventoryOrder.assignedTo) ? null : this.inventoryOrder.assignedTo.uid,
      notes: this.inventoryOrder.notes,
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
    const confirmType: 'AcceptCancel' | 'DeleteCancel' =
      eventType === InventoryOrderHeaderEventType.DELETE_INVENTORY_ORDER ? 'DeleteCancel' : 'AcceptCancel';
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


  private getConfirmTitle(eventType: InventoryOrderHeaderEventType): string {
    switch (eventType) {
      case InventoryOrderHeaderEventType.DELETE_INVENTORY_ORDER: return 'Eliminar orden de inventario';
      case InventoryOrderHeaderEventType.CLOSE_INVENTORY_ORDER: return 'Aplicar orden de inventario';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: InventoryOrderHeaderEventType): string {
    switch (eventType) {
      case InventoryOrderHeaderEventType.DELETE_INVENTORY_ORDER:
        return `Esta operación eliminará la orden de inventario
                <strong> ${this.inventoryOrder.inventoryOrderType.name}:
                ${this.inventoryOrder.inventoryOrderNo}</strong>.
                <br><br>¿Elimino la orden de inventario?`;

      case InventoryOrderHeaderEventType.CLOSE_INVENTORY_ORDER:
        return `Esta operación aplicará la orden de inventario
                <strong> ${this.inventoryOrder.inventoryOrderType.name}:
                ${this.inventoryOrder.inventoryOrderNo}</strong>.
                <br><br>¿Aplico la orden de inventario?`;

      default: return '';
    }
  }

}
