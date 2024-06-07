/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormHelper, FormatLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { MoneyAccountsDataService, SearcherAPIS } from '@app/data-services';

import { EmptyMoneyAccount, MoneyAccount, MoneyAccountFields } from '@app/models';


export enum MoneyAccountHeaderEventType {
  CREATE_MONEY_ACCOUNT = 'MoneyAccountHeaderComponent.Event.CreateMoneyAccount',
  UPDATE_MONEY_ACCOUNT = 'MoneyAccountHeaderComponent.Event.UpdateMoneyAccount',
  DELETE_MONEY_ACCOUNT = 'MoneyAccountHeaderComponent.Event.DeleteMoneyAccount',
}


interface MoneyAccountFormModel extends FormGroup<{
  moneyAccountType: FormControl<string>;
  moneyAccountNumber: FormControl<string>;
  moneyAccountOwner: FormControl<string>;
  moneyAccountLimit: FormControl<string>;
  limitDaysToPay: FormControl<string>;
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-money-account-header',
  templateUrl: './money-account-header.component.html',
})
export class MoneyAccountHeaderComponent implements OnChanges, OnInit {

  @Input() moneyAccount: MoneyAccount = EmptyMoneyAccount;

  @Output() moneyAccountHeaderEvent = new EventEmitter<EventInfo>();

  form: MoneyAccountFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  moneyAccountTypesList: Identifiable[] = [];

  accountHoldersAPI = SearcherAPIS.accountHolders;


  constructor(private moneyAccountsData: MoneyAccountsDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.moneyAccount && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  get isSaved(): boolean {
    return !isEmpty(this.moneyAccount);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = MoneyAccountHeaderEventType.CREATE_MONEY_ACCOUNT;

      if (this.isSaved) {
        eventType = MoneyAccountHeaderEventType.UPDATE_MONEY_ACCOUNT;
      }

      sendEvent(this.moneyAccountHeaderEvent, eventType, { moneyAccount: this.getFormData() });
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
    FormHelper.setDisableControl(this.form.controls.moneyAccountNumber);
    FormHelper.setDisableControl(this.form.controls.moneyAccountType, this.isSaved);
  }


  private loadDataLists() {
    this.isLoading = true;

    this.moneyAccountsData.getMoneyAccountTypes()
    .firstValue()
    .then(x => this.moneyAccountTypesList = x)
    .finally(() => this.isLoading = false);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      moneyAccountType: ['', Validators.required],
      moneyAccountNumber: ['', Validators.required],
      moneyAccountOwner: ['', Validators.required],
      moneyAccountLimit: ['', Validators.required],
      limitDaysToPay: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      moneyAccountType: this.moneyAccount.moneyAccountType.uid,
      moneyAccountNumber: this.moneyAccount.moneyAccountNumber,
      moneyAccountOwner: this.moneyAccount.moneyAccountOwner.uid,
      moneyAccountLimit: FormatLibrary.numberWithCommas(this.moneyAccount.moneyAccountLimit, '1.2-2'),
      limitDaysToPay: FormatLibrary.numberWithCommas(this.moneyAccount.limitDaysToPay, '1.2-2'),
      notes: this.moneyAccount.notes,
    });
  }


  private getFormData(): MoneyAccountFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: MoneyAccountFields = {
      typeUID: formModel.moneyAccountType ?? '',
      ownerUID: formModel.moneyAccountOwner ?? '',
      moneyAccountLimit: FormatLibrary.stringToNumber(formModel.moneyAccountLimit),
      limitDaysToPay: FormatLibrary.stringToNumber(formModel.limitDaysToPay),
      notes: formModel.notes ?? '',
    };

    return data;
  }


  private showConfirmDeleteMessage() {
    let message = `Esta operación eliminará la cuenta
                   <strong> ${this.moneyAccount.moneyAccountType.name}:
                   ${this.moneyAccount.moneyAccountNumber}</strong>.
                   <br><br>¿Elimino la cuenta?`;

    this.messageBox.confirm(message, 'Eliminar cuenta', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.moneyAccountHeaderEvent, MoneyAccountHeaderEventType.DELETE_MONEY_ACCOUNT,
            { moneyAccountUID: this.moneyAccount.uid });
        }
      });
  }

}
