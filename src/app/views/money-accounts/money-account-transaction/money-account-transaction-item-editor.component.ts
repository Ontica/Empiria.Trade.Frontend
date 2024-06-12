/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { MoneyAccountsDataService } from '@app/data-services';

import { MoneyAccountTransactionItem, MoneyAccountTransactionItemFields } from '@app/models';

export enum MoneyAccountTransactionItemEditorEventType {
  ADD_BUTTON_CLICKED    = 'MoneyAccountTransactionItemEditorComponent.Event.AddButtonClicked',
  CANCEL_BUTTON_CLICKED = 'MoneyAccountTransactionItemEditorComponent.Event.CancelButtonClicked',
  UPDATE_BUTTON_CLICKED = 'MoneyAccountTransactionItemEditorComponent.Event.UpdateButtonClicked',
}

interface MoneyAccountTransactionItemFormModel extends FormGroup<{
  itemTypeUID: FormControl<string>;
  paymentTypeUID: FormControl<string>;
  reference: FormControl<string>;
  deposit: FormControl<string>;
  withdrawal: FormControl<string>;
  notes: FormControl<string>;
  postedTime: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-trade-money-account-transaction-item-editor',
  templateUrl: './money-account-transaction-item-editor.component.html',
})
export class MoneyAccountTransactionItemEditorComponent implements OnChanges, OnInit {

  @Input() transactionUID = '';

  @Input() transactionItem: MoneyAccountTransactionItem = null;

  @Input() canEdit = false;

  @Output() transactionItemEditorEvent = new EventEmitter<EventInfo>();

  form: MoneyAccountTransactionItemFormModel;

  formHelper = FormHelper;

  isLoading = false;

  paymentTypes: Identifiable[] = [];

  transactionItemTypes: Identifiable[] = [];


  constructor(private moneyAccountsData: MoneyAccountsDataService) {
    this.initForm();
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.canEdit) {
      this.validateCanEdit();
    }

    if (changes.transactionItem) {
      this.setFormData();
    }
  }


  get isSaved(): boolean {
    return !isEmpty(this.transactionItem);
  }


  onAddTransactionItemClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        transactionUID: this.transactionUID,
        dataFields: this.getFormData()
      };

      sendEvent(this.transactionItemEditorEvent,
        MoneyAccountTransactionItemEditorEventType.ADD_BUTTON_CLICKED, payload);

      this.form.reset();
    }
  }


  onCancelEditionClicked() {
    sendEvent(this.transactionItemEditorEvent,
      MoneyAccountTransactionItemEditorEventType.CANCEL_BUTTON_CLICKED);
  }


  onUpdateTransactionItemClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        transactionUID: this.transactionUID,
        transactionItemUID: this.transactionItem.uid,
        itemFields: this.getFormData()
      }

      sendEvent(this.transactionItemEditorEvent,
        MoneyAccountTransactionItemEditorEventType.UPDATE_BUTTON_CLICKED, payload);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.moneyAccountsData.getMoneyAccountPaymentTypes(),
      this.moneyAccountsData.getMoneyAccountTransactionItemTypes(),
    ])
    .subscribe(([x, y]) => {
      this.paymentTypes = x;
      this.transactionItemTypes = y;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      itemTypeUID: ['', Validators.required],
      paymentTypeUID: ['', Validators.required],
      reference: ['', Validators.required],
      notes: ['', Validators.required],
      postedTime: [null as DateString, Validators.required],
      deposit: ['', Validators.required],
      withdrawal: ['', Validators.required],
    });

    this.form.disable()
  }



  private setFormData() {
    this.form.reset({
      itemTypeUID: this.transactionItem.itemType.uid ?? '',
      paymentTypeUID: this.transactionItem.paymentType.uid ?? '',
      reference: this.transactionItem.reference ?? '',
      deposit: FormatLibrary.numberWithCommas(this.transactionItem.deposit, '1.2-2'),
      withdrawal: FormatLibrary.numberWithCommas(this.transactionItem.withdrawal, '1.2-2'),
      notes: this.transactionItem.notes ?? '',
      postedTime: this.transactionItem.postedTime ?? '',
    });
  }


  private getFormData(): MoneyAccountTransactionItemFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: MoneyAccountTransactionItemFields = {
      itemTypeUID: formModel.itemTypeUID,
      paymentTypeUID: formModel.paymentTypeUID,
      reference: formModel.reference,
      deposit: FormatLibrary.stringToNumber(formModel.deposit),
      withdrawal: FormatLibrary.stringToNumber(formModel.withdrawal),
      notes: formModel.notes,
      postedTime: formModel.postedTime,
    };

    return data;
  }


  private validateCanEdit() {
    this.form.reset();

    if (this.canEdit) {
      this.formHelper.setDisableForm(this.form, false);
    } else {
      this.form.reset();
      this.formHelper.setDisableForm(this.form, true);
    }
  }

}
