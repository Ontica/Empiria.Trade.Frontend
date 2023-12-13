/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

export enum PackingStatusEventType {
  VIEW_STATUS_CLICKED  = 'PackingStatusComponent.Event.ViewStatusClicked',
  SEND_PACKING_CLICKED = 'PackingStatusComponent.Event.SendPackingClicked',
}

@Component({
  selector: 'emp-trade-packing-status',
  templateUrl: './packing-status.component.html',
})
export class PackingStatusComponent {

  @Input() missingItemsCount: number = 0;

  @Input() packingItemsCount: number = 0;

  @Input() canEdit = false;

  @Input() isLoading = false;

  @Input() hasError = false;

  @Output() packingStatusEvent = new EventEmitter<EventInfo>();


  constructor(private messageBox: MessageBoxService) {

  }


  onViewStatusClicked() {
    sendEvent(this.packingStatusEvent, PackingStatusEventType.VIEW_STATUS_CLICKED);
  }


  onSendPackingClicked() {
    this.showConfirmMessage();
  }


  private showConfirmMessage() {
    const title = 'Cerrar surtido';
    const message = `Esta operación cerrará el surtido y procederá con el envío.
      <br><br>¿Cierro el surtido?`;

    this.messageBox.confirm(message, title)
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.packingStatusEvent, PackingStatusEventType.SEND_PACKING_CLICKED);
        }
      });
  }

}
