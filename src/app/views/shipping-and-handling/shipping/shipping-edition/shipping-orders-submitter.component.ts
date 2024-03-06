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

import { EmptyShippingActions, EmptyShippingData, ShippingActions, ShippingData } from '@app/models';

export enum ShippingOrdersSubmitterEventType {
  TOGGLE_EDITION_MODE_CLICKED = 'ShippingOrdersSubmitterComponent.Event.ToggleEditionModeClicked',
  SAVE_SHIPPING_CLICKED       = 'ShippingOrdersSubmitterComponent.Event.SaveShippingClicked',
  SEND_SHIPPING_CLICKED       = 'ShippingOrdersSubmitterComponent.Event.SendShippingClicked',
  DELETE_SHIPPING_CLICKED     = 'ShippingOrdersSubmitterComponent.Event.DeleteShippingClicked',
}

@Component({
  selector: 'emp-trade-shipping-orders-submitter',
  templateUrl: './shipping-orders-submitter.component.html',
})
export class ShippingOrdersSubmitterComponent {

  @Input() shippingData: ShippingData = EmptyShippingData;

  @Input() actions: ShippingActions = EmptyShippingActions;

  @Input() isReady = false;

  @Input() editionMode = false;

  @Input() putOnPallets: boolean = false;

  @Output() putOnPalletsChange = new EventEmitter<boolean>();

  @Output() shippingOrdersSubmitterEvent = new EventEmitter<EventInfo>();


  constructor(private messageBox: MessageBoxService) {

  }


  get isSaved(): boolean {
    return !!this.shippingData.shippingUID;
  }


  onToggleEditionMode() {
    sendEvent(this.shippingOrdersSubmitterEvent, ShippingOrdersSubmitterEventType.TOGGLE_EDITION_MODE_CLICKED);
  }


  onSubmitButtonClicked() {
    if (this.isReady) {
      sendEvent(this.shippingOrdersSubmitterEvent, ShippingOrdersSubmitterEventType.SAVE_SHIPPING_CLICKED);
    }
  }


  onSendShipping() {
    this.confirmSendShipping();
  }


  onDeleteShipping() {
    this.confirmDeleteShipping();
  }


  private confirmSendShipping() {
    const message = `Esta operación pasará a embarque los pedidos seleccionados para su envío con la ` +
      `paquetería <strong> ${this.shippingData.parcelSupplier.name} </strong>. <br><br>¿Envío el pedido?`;

    this.messageBox.confirm(message, 'Enviar a embarque')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.shippingOrdersSubmitterEvent, ShippingOrdersSubmitterEventType.SEND_SHIPPING_CLICKED);
        }
      });
  }


  private confirmDeleteShipping() {
    const message = `Esta operación cancelara el envío de los pedidos seleccionados por la paquetería ` +
      `<strong> ${this.shippingData.parcelSupplier.name} </strong>. <br><br>¿Cancelo el envío?`;

    this.messageBox.confirm(message, 'Cancelar Envío')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.shippingOrdersSubmitterEvent, ShippingOrdersSubmitterEventType.DELETE_SHIPPING_CLICKED);
        }
      });
  }

}
