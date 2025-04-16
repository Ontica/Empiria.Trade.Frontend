/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, FormatLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { SearcherAPIS } from '@app/data-services';

import { EmptyMoneyAccount, MoneyAccount, MoneyAccountFields } from '@app/models';


export enum MoneyAccountHeaderEventType {
  CREATE_MONEY_ACCOUNT   = 'MoneyAccountHeaderComponent.Event.CreateMoneyAccount',
  UPDATE_MONEY_ACCOUNT   = 'MoneyAccountHeaderComponent.Event.UpdateMoneyAccount',
  DELETE_MONEY_ACCOUNT   = 'MoneyAccountHeaderComponent.Event.DeleteMoneyAccount',
  ACTIVATE_MONEY_ACCOUNT = 'MoneyAccountHeaderComponent.Event.ActivateMoneyAccount',
  SUSPEND_MONEY_ACCOUNT  = 'MoneyAccountHeaderComponent.Event.SuspendMoneyAccount',
  PENDING_MONEY_ACCOUNT  = 'MoneyAccountHeaderComponent.Event.PendingMoneyAccount',
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
export class MoneyAccountHeaderComponent implements OnChanges, OnInit, OnDestroy {

  @Input() moneyAccount: MoneyAccount = EmptyMoneyAccount;

  @Output() moneyAccountHeaderEvent = new EventEmitter<EventInfo>();

  form: MoneyAccountFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  moneyAccountTypesList: Identifiable[] = [];

  accountHoldersAPI = SearcherAPIS.accountHolders;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
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


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !isEmpty(this.moneyAccount);
  }


  get hasActions(): boolean {
    return this.moneyAccount.actions.canEdit || this.moneyAccount.actions.canDelete ||
           this.moneyAccount.actions.canSuspend || this.moneyAccount.actions.canActivate ||
           this.moneyAccount.actions.canSetPending;
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
    this.showConfirmMessage(MoneyAccountHeaderEventType.DELETE_MONEY_ACCOUNT);
  }


  onSuspendButtonClicked() {
    this.showConfirmMessage(MoneyAccountHeaderEventType.SUSPEND_MONEY_ACCOUNT);
  }


  onActivateButtonClicked() {
    this.showConfirmMessage(MoneyAccountHeaderEventType.ACTIVATE_MONEY_ACCOUNT);
  }


  onPendingButtonClicked() {
    this.showConfirmMessage(MoneyAccountHeaderEventType.PENDING_MONEY_ACCOUNT);
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

    this.helper.select<Identifiable[]>(CataloguesStateSelector.MONEY_ACCOUNT_TYPES)
      .subscribe(x => {
        this.moneyAccountTypesList = x;
        this.isLoading = false;
      });
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


  private showConfirmMessage(eventType: MoneyAccountHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.moneyAccountHeaderEvent, MoneyAccountHeaderEventType.DELETE_MONEY_ACCOUNT,
            { moneyAccountUID: this.moneyAccount.uid });
        }
      });
  }


  private getConfirmType(eventType: MoneyAccountHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case MoneyAccountHeaderEventType.DELETE_MONEY_ACCOUNT:
      case MoneyAccountHeaderEventType.SUSPEND_MONEY_ACCOUNT:
      case MoneyAccountHeaderEventType.PENDING_MONEY_ACCOUNT:
        return 'DeleteCancel';

      case MoneyAccountHeaderEventType.ACTIVATE_MONEY_ACCOUNT:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: MoneyAccountHeaderEventType): string {
    switch (eventType) {
      case MoneyAccountHeaderEventType.DELETE_MONEY_ACCOUNT: return 'Eliminar cuenta';
      case MoneyAccountHeaderEventType.SUSPEND_MONEY_ACCOUNT: return 'Suspender cuenta';
      case MoneyAccountHeaderEventType.ACTIVATE_MONEY_ACCOUNT: return 'Activar cuenta';
      case MoneyAccountHeaderEventType.PENDING_MONEY_ACCOUNT: return 'Bloquear cuenta';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: MoneyAccountHeaderEventType): string {
    switch (eventType) {
      case MoneyAccountHeaderEventType.DELETE_MONEY_ACCOUNT:
        return `Esta operación eliminará la cuenta
                <strong> ${this.moneyAccount.moneyAccountType.name}:
                ${this.moneyAccount.moneyAccountNumber}</strong>.
                <br><br>¿Elimino la cuenta?`;

      case MoneyAccountHeaderEventType.SUSPEND_MONEY_ACCOUNT:
        return `Esta operación suspenderá la cuenta
                <strong> ${this.moneyAccount.moneyAccountType.name}:
                ${this.moneyAccount.moneyAccountNumber}</strong>.
                <br><br>¿Suspendo la cuenta?`;

      case MoneyAccountHeaderEventType.ACTIVATE_MONEY_ACCOUNT:
        return `Esta operación reactivará la cuenta
                <strong> ${this.moneyAccount.moneyAccountType.name}:
                ${this.moneyAccount.moneyAccountNumber}</strong>.
                <br><br>¿Activo la cuenta?`;

      case MoneyAccountHeaderEventType.PENDING_MONEY_ACCOUNT:
        return `Esta operación bloqueará la cuenta
                <strong> ${this.moneyAccount.moneyAccountType.name}:
                ${this.moneyAccount.moneyAccountNumber}</strong>.
                <br><br>¿Bloqueo la cuenta?`;

      default: return '';
    }
  }

}
