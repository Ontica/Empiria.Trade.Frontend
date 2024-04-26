/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyMoneyAccount, MoneyAccount } from '@app/models';

import { MoneyAccountHeaderEventType } from './money-account-header.component';

@Component({
  selector: 'emp-trade-money-account-editor',
  templateUrl: './money-account-editor.component.html',
})
export class MoneyAccountEditorComponent {

  @Input() moneyAccount: MoneyAccount = EmptyMoneyAccount;

  submitted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onMoneyAccountHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as MoneyAccountHeaderEventType) {
      case MoneyAccountHeaderEventType.UPDATE_MONEY_ACCOUNT:
        Assertion.assertValue(event.payload.moneyAccount, 'event.payload.moneyAccount');
        this.messageBox.showInDevelopment('Actualizar orden de inventario', event.payload.moneyAccount);
        return;

      case MoneyAccountHeaderEventType.DELETE_MONEY_ACCOUNT:
        Assertion.assertValue(event.payload.moneyAccountUID, 'event.payload.moneyAccountUID');
        this.messageBox.showInDevelopment('Eliminar orden de inventario', event.payload.moneyAccountUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
