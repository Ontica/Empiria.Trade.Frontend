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

import { FormHelper, sendEvent } from '@app/shared/utils';

import { ContactsDataService } from '@app/data-services';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyInventoryOrder, InventoryOrder, InventoryOrderFields } from '@app/models';


export enum InventoryOrderHeaderEventType {
  CREATE_INVENTORY_ORDER = 'InventoryOrderHeaderComponent.Event.CreateInventoryOrder',
  UPDATE_INVENTORY_ORDER = 'InventoryOrderHeaderComponent.Event.UpdateInventoryOrder',
  DELETE_INVENTORY_ORDER = 'InventoryOrderHeaderComponent.Event.DeleteInventoryOrder',
}


interface InventoryOrderFormModel extends FormGroup<{
  inventoryOrderType: FormControl<string>;
  inventoryOrderNo: FormControl<string>;
  responsible: FormControl<string>;
  assignedTo: FormControl<string>;
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-inventory-order-header',
  templateUrl: './inventory-order-header.component.html',
})
export class InventoryOrderHeaderComponent implements OnChanges, OnInit, OnDestroy {

  @Input() inventoryOrder: InventoryOrder = EmptyInventoryOrder;

  @Output() inventoryOrderHeaderEvent = new EventEmitter<EventInfo>();

  form: InventoryOrderFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  inventoryTypesList: Identifiable[] = [];

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


  get isSaved(): boolean {
    return !isEmpty(this.inventoryOrder);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = InventoryOrderHeaderEventType.CREATE_INVENTORY_ORDER;

      if (this.isSaved) {
        eventType = InventoryOrderHeaderEventType.UPDATE_INVENTORY_ORDER;
      }

      sendEvent(this.inventoryOrderHeaderEvent, eventType, { inventoryOrder: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmDeleteMessage();
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHelper.setDisableForm(this.form, !this.editionMode);
    FormHelper.setDisableControl(this.form.controls.inventoryOrderNo);
    FormHelper.setDisableControl(this.form.controls.inventoryOrderType, this.isSaved);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.INVENTORY_ORDER_TYPES),
      this.contactsData.getWarehousemen()
    ])
    .subscribe(([x, y]) => {
      this.inventoryTypesList = x;
      this.warehousemenList = y;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      inventoryOrderType: ['', Validators.required],
      inventoryOrderNo: ['', Validators.required],
      responsible: ['', Validators.required],
      assignedTo: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      inventoryOrderType: this.inventoryOrder.inventoryOrderType.uid,
      inventoryOrderNo: this.inventoryOrder.inventoryOrderNo,
      responsible: this.inventoryOrder.responsible.uid,
      assignedTo: this.inventoryOrder.assignedTo.uid,
      notes: this.inventoryOrder.notes,
    });
  }


  private getFormData(): InventoryOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: InventoryOrderFields = {
      inventoryOrderTypeUID: formModel.inventoryOrderType ?? '',
      responsibleUID: formModel.responsible ?? '',
      assignedToUID: formModel.assignedTo ?? '',
      notes: formModel.notes ?? '',
    };

    return data;
  }


  private showConfirmDeleteMessage() {
    let message = `Esta operación eliminará la orden de inventario
                   <strong> ${this.inventoryOrder.inventoryOrderType.name}:
                   ${this.inventoryOrder.inventoryOrderNo}</strong>.
                   <br><br>¿Elimino la orden de inventario?`;

    this.messageBox.confirm(message, 'Eliminar orden de inventario', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.inventoryOrderHeaderEvent, InventoryOrderHeaderEventType.DELETE_INVENTORY_ORDER,
            { inventoryOrderUID: this.inventoryOrder.uid });
        }
      });
  }

}
