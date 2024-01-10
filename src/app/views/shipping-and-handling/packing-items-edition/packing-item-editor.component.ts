/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PackingDataService } from '@app/data-services';

import { PackingItem, PackingItemFields } from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';


export enum PackingItemEditorEventType {
  CLOSE_MODAL_CLICKED = 'PackingItemEditorComponent.Event.CloseEditorClicked',
  CREATE_ENTRY        = 'PackingItemEditorComponent.Event.CreateEntry',
  UPDATE_ENTRY        = 'PackingItemEditorComponent.Event.UpdateEntry',
}

interface PackingItemFormModel extends FormGroup<{
  packageID: FormControl<string>;
  packageTypeUID: FormControl<string>;
}> { }


@Component({
  selector: 'emp-trade-packing-item-editor',
  templateUrl: './packing-item-editor.component.html',
})
export class PackingItemEditorComponent implements OnChanges, OnInit {

  @Input() orderUID = '';

  @Input() packingItem: PackingItem = null;

  @Output() packingItemEditorEvent = new EventEmitter<EventInfo>();

  form: PackingItemFormModel;

  formHelper = FormHelper;

  isLoading = false;

  packageTypeList: Identifiable[] = [];


  constructor(private packingData: PackingDataService) {
    this.initForm();
  }


  ngOnInit() {
    this.loadDataList();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.packingItem) {
      this.setFormData();
    }
  }


  get isSaved(): boolean {
    return !!this.packingItem;
  }


  onCloseClicked() {
    sendEvent(this.packingItemEditorEvent, PackingItemEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? PackingItemEditorEventType.UPDATE_ENTRY :
        PackingItemEditorEventType.CREATE_ENTRY;

      const payload = {
        packingItemUID: this.isSaved ? this.packingItem.uid : null,
        packingItem: this.getFormData()
      };

      sendEvent(this.packingItemEditorEvent, eventType, payload);
    }
  }


  private loadDataList() {
    this.isLoading = true;

    this.packingData.getPackageType()
      .subscribe(x => {
        this.packageTypeList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      packageID: ['', Validators.required],
      packageTypeUID: ['', Validators.required],
    });
  }


  private setFormData() {
    if (this.isSaved) {
      this.form.reset({
        packageID: this.packingItem.packageID,
        packageTypeUID: this.packingItem.packageTypeUID,
      });
    }
  }


  private getFormData(): PackingItemFields {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: PackingItemFields = {
      orderUID: this.orderUID,
      packageID: formModel.packageID ?? '',
      packageTypeUID: formModel.packageTypeUID ?? '',
    };

    return data;
  }

}
