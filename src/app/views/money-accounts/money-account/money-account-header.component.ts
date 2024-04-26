/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { ArrayLibrary, FormHelper, FormatLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { MoneyAccountsDataService } from '@app/data-services';

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

  partiesList: Identifiable[] = [];


  constructor(private moneyAccountsData: MoneyAccountsDataService,
              private messageBox: MessageBoxService
  ) {
    this.initForm();
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
  }


  private loadDataLists() {
    this.isLoading = true;

    this.moneyAccountsData.getMoneyAccountTypes()
    .firstValue()
    .then(x => {
      this.moneyAccountTypesList = x;
      this.validatePartyInList();
    })
    .finally(() => this.isLoading = false);
  }


  private validatePartyInList() {
    if (!isEmpty(this.moneyAccount.moneyAccountOwner)) {
      this.partiesList =
        ArrayLibrary.insertIfNotExist(this.partiesList ?? [], this.moneyAccount.moneyAccountOwner, 'uid');
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      moneyAccountType: ['', Validators.required],
      moneyAccountNumber: ['', Validators.required],
      moneyAccountOwner: ['', Validators.required],
      moneyAccountLimit: ['', Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      moneyAccountType: this.moneyAccount.moneyAccountType.uid,
      moneyAccountNumber: this.moneyAccount.moneyAccountNumber,
      moneyAccountOwner: this.moneyAccount.moneyAccountOwner.uid,
      moneyAccountLimit: FormatLibrary.numberWithCommas(this.moneyAccount.moneyAccountLimit, '1.2-2'),
    });

    this.validatePartyInList();
  }


  private getFormData(): MoneyAccountFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: MoneyAccountFields = {
      moneyAccountTypeUID: formModel.moneyAccountType ?? '',
      moneyAccountNumber: formModel.moneyAccountNumber ?? '',
      moneyAccountOwnerUID: formModel.moneyAccountOwner ?? '',
      moneyAccountLimit: FormatLibrary.stringToNumber(formModel.moneyAccountLimit),
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
