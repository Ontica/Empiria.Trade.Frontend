/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { MissingItem } from '@app/models';

import { sendEvent } from '@app/shared/utils';


export enum MissingItemsModalEventType {
  CLOSE_MODAL_CLICKED = 'MissingItemsModalComponent.Event.CloseEditorClicked',
}

@Component({
  selector: 'emp-trade-missing-items-modal',
  templateUrl: './missing-items-modal.component.html',
})
export class MissingItemsModalComponent {

  @Input() missingItems: MissingItem[] = [];

  @Input() orderNumber = '';

  @Output() missingItemsModalEvent = new EventEmitter<EventInfo>();


  onClose() {
    sendEvent(this.missingItemsModalEvent, MissingItemsModalEventType.CLOSE_MODAL_CLICKED);
  }

}
