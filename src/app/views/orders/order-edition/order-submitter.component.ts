/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApplicationStatusService, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyOrder, Order } from '@app/models';

import { OrderConfirmSubmitModalEventType, OrderSubmitType } from './order-confirm-submit-modal.component';


export enum OrderSubmitterEventType {
  TOGGLE_EDITION_MODE_CLICKED = 'OrderSubmitterComponent.Event.ToggleEditionModeClicked',
  CREATE_BUTTON_CLICKED       = 'OrderSubmitterComponent.Event.CreateButtonClicked',
  UPDATE_BUTTON_CLICKED       = 'OrderSubmitterComponent.Event.UpdateButtonClicked',
  CANCEL_BUTTON_CLICKED       = 'OrderSubmitterComponent.Event.CancelButtonClicked',
  APPLY_BUTTON_CLICKED        = 'OrderSubmitterComponent.Event.ApplyButtonClicked',
  AUTHORIZE_BUTTON_CLICKED    = 'OrderSubmitterComponent.Event.AuthorizeButtonClicked',
  DEAUTHORIZE_BUTTON_CLICKED  = 'OrderSubmitterComponent.Event.DeauthorizeButtonClicked',
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

  confirmModalMode: OrderSubmitType  = null;


  constructor(private appStatus: ApplicationStatusService) { }


  get hasActions(): boolean {
    return this.order.actions.can.update || this.order.actions.can.apply ||
           this.order.actions.can.authorize || this.order.actions.can.deauthorize;
  }


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
    this.confirmModalMode = 'Cancel';
  }


  onApplyButtonClicked() {
    this.confirmModalMode = 'Apply';
  }


  onAuthorizeButtonClicked() {
    this.confirmModalMode = 'Authorize';
  }


  onDeauthorizeButtonClicked() {
    this.confirmModalMode = 'Desauthorize';
  }


  onOrderConfirmSubmitModalEvent(event: EventInfo){
    switch (event.type as OrderConfirmSubmitModalEventType) {
      case OrderConfirmSubmitModalEventType.CLOSE_BUTTON_CLICKED:
        this.confirmModalMode = null;
        return;

      case OrderConfirmSubmitModalEventType.SUBMIT_BUTTON_CLICKED:
        this.validateActionConfirmedToEmit(event.payload.notes ?? null);
        this.confirmModalMode = null;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateActionConfirmedToEmit(notes: string) {
    switch (this.confirmModalMode) {
      case 'Cancel':
        sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.CANCEL_BUTTON_CLICKED);
        return;
      case 'Apply':
        sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.APPLY_BUTTON_CLICKED);
        return;
      case 'Authorize':
        sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.AUTHORIZE_BUTTON_CLICKED);
        return;
      case 'Desauthorize':
        sendEvent(this.orderSubmitterEvent, OrderSubmitterEventType.DEAUTHORIZE_BUTTON_CLICKED, { notes });
        return;
      default:
        console.log(`Unhandled user interface action ${this.confirmModalMode}`);
        return;
    }
  }

}
