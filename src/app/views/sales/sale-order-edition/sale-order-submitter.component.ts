/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApplicationStatusService, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptySaleOrder, SaleOrder } from '@app/models';

import { SaleOrderConfirmSubmitModalEventType, SaleOrderSubmitType } from './sale-order-confirm-submit-modal.component';


export enum SaleOrderSubmitterEventType {
  TOGGLE_EDITION_MODE_CLICKED = 'SaleOrderSubmitterComponent.Event.ToggleEditionModeClicked',
  CREATE_BUTTON_CLICKED       = 'SaleOrderSubmitterComponent.Event.CreateButtonClicked',
  UPDATE_BUTTON_CLICKED       = 'SaleOrderSubmitterComponent.Event.UpdateButtonClicked',
  CANCEL_BUTTON_CLICKED       = 'SaleOrderSubmitterComponent.Event.CancelButtonClicked',
  APPLY_BUTTON_CLICKED        = 'SaleOrderSubmitterComponent.Event.ApplyButtonClicked',
  AUTHORIZE_BUTTON_CLICKED    = 'SaleOrderSubmitterComponent.Event.AuthorizeButtonClicked',
  DEAUTHORIZE_BUTTON_CLICKED  = 'SaleOrderSubmitterComponent.Event.DeauthorizeButtonClicked',
}

@Component({
  selector: 'emp-trade-sale-order-submitter',
  templateUrl: './sale-order-submitter.component.html',
  styles: [`
    button {
      min-width: 150px;
    }
  `],
})
export class SaleOrderSubmitterComponent {

  @Input() order: SaleOrder = EmptySaleOrder();

  @Input() isSaved = false;

  @Input() isReady = false;

  @Input() canEdit = false;

  @Input() editionMode = false;

  @Output() saleOrderSubmitterEvent = new EventEmitter<EventInfo>();

  confirmModalMode: SaleOrderSubmitType  = null;


  constructor(private appStatus: ApplicationStatusService) { }


  get hasActions(): boolean {
    return this.order.actions.can.update || this.order.actions.can.apply ||
           this.order.actions.can.authorize || this.order.actions.can.deauthorize;
  }


  onCreateButtonClicked() {
    sendEvent(this.saleOrderSubmitterEvent, SaleOrderSubmitterEventType.CREATE_BUTTON_CLICKED);
  }


  onToggleEditionMode() {
    this.appStatus.canUserContinue()
      .subscribe( x =>
        x ? sendEvent(this.saleOrderSubmitterEvent, SaleOrderSubmitterEventType.TOGGLE_EDITION_MODE_CLICKED) : null
      );
  }


  onUpdateButtonClicked() {
    sendEvent(this.saleOrderSubmitterEvent, SaleOrderSubmitterEventType.UPDATE_BUTTON_CLICKED);
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


  onSaleOrderConfirmSubmitModalEvent(event: EventInfo){
    switch (event.type as SaleOrderConfirmSubmitModalEventType) {
      case SaleOrderConfirmSubmitModalEventType.CLOSE_BUTTON_CLICKED:
        this.confirmModalMode = null;
        return;

      case SaleOrderConfirmSubmitModalEventType.SUBMIT_BUTTON_CLICKED:
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
        sendEvent(this.saleOrderSubmitterEvent, SaleOrderSubmitterEventType.CANCEL_BUTTON_CLICKED);
        return;
      case 'Apply':
        sendEvent(this.saleOrderSubmitterEvent, SaleOrderSubmitterEventType.APPLY_BUTTON_CLICKED);
        return;
      case 'Authorize':
        sendEvent(this.saleOrderSubmitterEvent, SaleOrderSubmitterEventType.AUTHORIZE_BUTTON_CLICKED);
        return;
      case 'Desauthorize':
        sendEvent(this.saleOrderSubmitterEvent, SaleOrderSubmitterEventType.DEAUTHORIZE_BUTTON_CLICKED, { notes });
        return;
      default:
        console.log(`Unhandled user interface action ${this.confirmModalMode}`);
        return;
    }
  }

}
