/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormHelper, FormatLibrary, sendEvent } from '@app/shared/utils';

import { MoneyAccountsDataService } from '@app/data-services';

import { MoneyAccountTransaction, MoneyAccountTransactionFields } from '@app/models';

import { MoneyAccountTransactionItemsEventType } from './money-account-transaction-items-table.component';

import { MoneyAccountTransactionItemEditorEventType } from './money-account-transaction-item-editor.component';


export enum MoneyAccountTransactionEditorEventType {
  CLOSE_BUTTON_CLICKED    = 'MoneyAccountTransactionEditorComponent.Event.CloseButtonClicked',
  CREATE_TRANSACTION      = 'MoneyAccountTransactionEditorComponent.Event.CreateTransaction',
  UPDATE_TRANSACTION      = 'MoneyAccountTransactionEditorComponent.Event.UpdateTransaction',
  CREATE_TRANSACTION_ITEM = 'MoneyAccountTransactionEditorComponent.Event.CreateTransactionItem',
  REMOVE_TRANSACTION_ITEM = 'MoneyAccountTransactionEditorComponent.Event.RemoveTransactionItem',
}

interface MoneyAccountTransactionFormModel extends FormGroup<{
  transactionTypeUID: FormControl<string>;
  transactionNumber: FormControl<string>;
  reference: FormControl<string>;
  transactionAmount: FormControl<string>;
  transactionTime: FormControl<DateString>;
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-money-account-transaction-editor',
  templateUrl: './money-account-transaction-editor.component.html',
})
export class MoneyAccountTransactionEditorComponent implements OnChanges, OnInit {

  @Input() transaction: MoneyAccountTransaction = null;

  @Input() canEdit = false;

  @Output() moneyAccountTransactionEditorEvent = new EventEmitter<EventInfo>();

  form: MoneyAccountTransactionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  transactionTypes: Identifiable[] = [];


  constructor(private moneyAccountsData: MoneyAccountsDataService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transaction && this.isSaved) {
      this.enableEditor(false);
    }
  }


  get isSaved(): boolean {
    return !isEmpty(this.transaction);
  }


  onTransactionItemEditorEvent(event: EventInfo) {
    switch (event.type as MoneyAccountTransactionItemEditorEventType) {
      case MoneyAccountTransactionItemEditorEventType.ADD_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');

        sendEvent(this.moneyAccountTransactionEditorEvent,
          MoneyAccountTransactionEditorEventType.CREATE_TRANSACTION_ITEM, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onMoneyAccountTransactionItemsEvent(event: EventInfo) {
    switch (event.type as MoneyAccountTransactionItemsEventType) {
      case MoneyAccountTransactionItemsEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.transactionItemUID, 'event.payload.transactionItemUID');

        sendEvent(this.moneyAccountTransactionEditorEvent,
          MoneyAccountTransactionEditorEventType.REMOVE_TRANSACTION_ITEM, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseButtonClicked() {
    sendEvent(this.moneyAccountTransactionEditorEvent,
      MoneyAccountTransactionEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ?
        MoneyAccountTransactionEditorEventType.UPDATE_TRANSACTION :
        MoneyAccountTransactionEditorEventType.CREATE_TRANSACTION;

      const payload = {
        transactionUID: this.isSaved ? this.transaction.uid : null,
        dataFields: this.getFormData(),
      };

      sendEvent(this.moneyAccountTransactionEditorEvent, eventType, payload);
    }
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHelper.setDisableForm(this.form, !this.editionMode);
    this.formHelper.setDisableControl(this.form.controls.transactionNumber);
  }


  private loadDataLists() {
    this.isLoading = true;

    this.moneyAccountsData.getMoneyAccountTransactionTypes()
      .firstValue()
      .then(x => this.transactionTypes = x)
      .finally(() => this.isLoading = false)
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      transactionTypeUID: ['', Validators.required],
      transactionNumber: ['', Validators.required],
      reference: ['', Validators.required],
      transactionAmount: ['', Validators.required],
      transactionTime: [null as DateString, Validators.required],
      notes: ['', Validators.required],
    });
  }


  private setFormData() {

    this.form.reset({
      transactionTypeUID: this.transaction.transactionType.uid ?? '',
      transactionNumber: this.transaction.transactionNumber ?? '',
      reference: this.transaction.reference ?? '',
      transactionAmount: FormatLibrary.numberWithCommas(this.transaction.transactionAmount, '1.2-2'),
      transactionTime: this.transaction.transactionDate ?? null,
      notes: this.transaction.notes ?? '',
    });
  }


  private getFormData(): MoneyAccountTransactionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: MoneyAccountTransactionFields = {
      transactionTypeUID: formModel.transactionTypeUID,
      transactionTime: formModel.transactionTime,
      transactionAmount: FormatLibrary.stringToNumber(formModel.transactionAmount),
      reference: formModel.reference,
      notes: formModel.notes,
    };

    return data;
  }

}
