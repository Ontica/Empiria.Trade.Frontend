/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApplicationStatusService, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { EmptyOrder, Order } from '@app/models';


export enum OrderSubmitterEventType {
  TOGGLE_EDITION_MODE_CLICKED = 'OrderSubmitterComponent.Event.ToggleEditionModeClicked',
  CREATE_BUTTON_CLICKED       = 'OrderSubmitterComponent.Event.CreateButtonClicked',
  UPDATE_BUTTON_CLICKED       = 'OrderSubmitterComponent.Event.UpdateButtonClicked',
  CANCEL_BUTTON_CLICKED       = 'OrderSubmitterComponent.Event.CancelButtonClicked',
  APPLY_BUTTON_CLICKED        = 'OrderSubmitterComponent.Event.ApplyButtonClicked',
  AUTHORIZE_BUTTON_CLICKED    = 'OrderSubmitterComponent.Event.AuthorizeButtonClicked',
}

@Component({
  selector: 'emp-trade-order-submitter',
  templateUrl: './order-submitter.component.html',
  styles: [`
    button {
      min-width: 150px;
    }
  `],
})
export class OrderSubmitterComponent {

  @Input() order: Order = EmptyOrder();

  @Input() isSaved = false;

  @Input() isReady = false;

  @Input() canEdit = false;

  @Input() editionMode = false;

  @Output() orderSubmitterEvent = new EventEmitter<EventInfo>();


  constructor(private appStatus: ApplicationStatusService,
              private messageBox: MessageBoxService) { }


  onCreateButtonClicked() {
    sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.CREATE_BUTTON_CLICKED);
  }


  onToggleEditionMode() {
    this.appStatus.canUserContinue()
      .subscribe( x =>
        x ? sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.TOGGLE_EDITION_MODE_CLICKED) : null
      );
  }


  onUpdateButtonClicked() {
    sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.UPDATE_BUTTON_CLICKED);
  }


  onCancelButtonClicked() {
    this.confirmCancel();
  }


  onSendToButtonClicked() {
    this.confirmSendTo();
  }


  onAuthorizeButtonClicked() {
    this.confirmAuthorize();
  }


  private confirmCancel() {
    const message = `Esta operación eliminara el pedido <strong> ${this.order.orderData.orderNumber} </strong>
                    <br><br>¿Elimino el pedido?`;
    this.messageBox.confirm(message, 'Eliminar pedido', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.CANCEL_BUTTON_CLICKED);
        }
      });
  }


  private confirmSendTo() {
    const message = `Esta operación enviará el pedido <strong> ${this.order.orderData.orderNumber} </strong> ` +
                    `a almacen para ser procesado. <br><br>¿Aplico el pedido?`;

    this.messageBox.confirm(message, 'Aplicar pedido')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.APPLY_BUTTON_CLICKED);
        }
      });
  }


  private confirmAuthorize() {
    const message = `Esta operación autorizará el pedido <strong> ${this.order.orderData.orderNumber} </strong> ` +
                    `del cliente <strong>${this.order.orderData.customer.name}</strong> con adeudo de ` +
                    `<strong class="warning-text">` +
                    FormatLibrary.numberWithCommas(this.order.customerCredit.totalDebt, '1.2-2') +
                    `</strong><br><br>¿Autorizo el pedido?`;

    this.messageBox.confirm(message, 'Autorizar pedido', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.AUTHORIZE_BUTTON_CLICKED);
        }
      });
  }

}
