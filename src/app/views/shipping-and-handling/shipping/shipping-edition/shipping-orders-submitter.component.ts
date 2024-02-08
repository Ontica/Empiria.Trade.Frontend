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

import { EmptyShippingData, ShippingData } from '@app/models';

export enum ShippingOrdersSubmitterEventType {
  SAVE_SHIPPING_CLICKED = 'ShippingOrdersSubmitterComponent.Event.SaveShippingClicked',
  SEND_SHIPPING_CLICKED = 'ShippingOrdersSubmitterComponent.Event.SendShippingClicked',
}

@Component({
  selector: 'emp-trade-shipping-orders-submitter',
  templateUrl: './shipping-orders-submitter.component.html',
})
export class ShippingOrdersSubmitterComponent {

  @Input() shippingData: ShippingData = EmptyShippingData;

  @Input() canEdit = false;

  @Input() isReady = false;

  @Input() putOnPallets: boolean = false;

  @Output() putOnPalletsChange = new EventEmitter<boolean>();

  @Output() shippingOrdersSubmitterEvent = new EventEmitter<EventInfo>();


  constructor(private messageBox: MessageBoxService) {

  }


  get canSendOrder(): boolean {
    return this.canEdit && !!this.shippingData.shippingUID;
  }


  onSubmitButtonClicked() {
    if (this.isReady) {
      sendEvent(this.shippingOrdersSubmitterEvent, ShippingOrdersSubmitterEventType.SAVE_SHIPPING_CLICKED);
    }
  }


  onSendOrder() {
    this.confirmSendOrder();
  }


  private confirmSendOrder() {
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

}
