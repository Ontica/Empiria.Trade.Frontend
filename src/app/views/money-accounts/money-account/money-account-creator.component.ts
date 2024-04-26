/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { MoneyAccountHeaderEventType } from './money-account-header.component';

export enum MoneyAccountCreatorEventType {
  CLOSE_MODAL_CLICKED = 'MoneyAccountCreatorComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-trade-money-account-creator',
  templateUrl: './money-account-creator.component.html',
})
export class MoneyAccountCreatorComponent {

  @Output() moneyAccountCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onCloseModalClicked() {
    sendEvent(this.moneyAccountCreatorEvent, MoneyAccountCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onMoneyAccountHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as MoneyAccountHeaderEventType) {
      case MoneyAccountHeaderEventType.CREATE_MONEY_ACCOUNT:
        Assertion.assertValue(event.payload.moneyAccount, 'event.payload.moneyAccount');
        this.messageBox.showInDevelopment('Agregar cuenta', event.payload.moneyAccount);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
