/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptySaleOrder, SaleOrder } from '@app/models';


export type SaleOrderSubmitType = 'Cancel' | 'Apply' | 'Authorize' | 'Desauthorize';


export enum SaleOrderConfirmSubmitModalEventType {
  CLOSE_BUTTON_CLICKED  = 'SaleOrderConfirmSubmitModalComponent.Event.CloseButtonClicked',
  SUBMIT_BUTTON_CLICKED = 'SaleOrderConfirmSubmitModalComponent.Event.SubmitButtonClicked',
}

@Component({
  selector: 'emp-trade-sale-order-confirm-submit-modal',
  templateUrl: './sale-order-confirm-submit-modal.component.html',
})
export class SaleOrderConfirmSubmitModalComponent {

  @Input() order: SaleOrder = EmptySaleOrder();

  @Input() mode: SaleOrderSubmitType = 'Desauthorize';

  @Output() saleOrderConfirmSubmitModalEvent = new EventEmitter<EventInfo>();

  notes = '';


  get showWarningColor(): boolean {
    return this.mode !== 'Apply';
  }


  get showTotalDebt(): boolean {
    return this.mode === 'Authorize';
  }

  get showApplyText(): boolean {
    return this.mode === 'Apply';
  }


  get notesRequired(): boolean {
    return this.mode === 'Desauthorize';
  }


  get titleText(): string {
    switch (this.mode) {
      case 'Cancel': return 'Eliminar pedido';
      case 'Apply': return 'Aplicar pedido';
      case 'Authorize': return 'Autorizar pedido';
      case 'Desauthorize': return 'Desautorizar pedido';
      default: return 'Realizar operación'
    }
  }


  get actionText(): string {
    switch (this.mode) {
      case 'Cancel': return 'eliminará';
      case 'Apply': return 'enviará';
      case 'Authorize': return 'autorizará';
      case 'Desauthorize': return 'desautorizará';
      default: return 'realizará';
    }
  }


  get questionText(): string {
    switch (this.mode) {
      case 'Cancel': return 'Elimino';
      case 'Apply': return 'Aplico';
      case 'Authorize': return 'Autorizo';
      case 'Desauthorize': return 'Desautorizo';
      default: return 'Realizo';
    }
  }


  get submitText(): string {
    switch (this.mode) {
      case 'Cancel': return 'Eliminar';
      case 'Apply': return 'Aplicar';
      case 'Authorize': return 'Autorizar';
      case 'Desauthorize': return 'Desautorizar';
      default: return 'Aceptar';
    }
  }


  get isReady(): boolean {
    return this.notesRequired ? !!this.notes : true;
  }


  onCloseButtonClicked() {
    sendEvent(this.saleOrderConfirmSubmitModalEvent, SaleOrderConfirmSubmitModalEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    sendEvent(this.saleOrderConfirmSubmitModalEvent, SaleOrderConfirmSubmitModalEventType.SUBMIT_BUTTON_CLICKED,
      { notes: this.notes }
    );
  }

}
