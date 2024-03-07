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
  TOGGLE_EDITION_MODE_CLICKED   = 'ShippingOrdersSubmitterComponent.Event.ToggleEditionModeClicked',
  SAVE_SHIPPING_CLICKED         = 'ShippingOrdersSubmitterComponent.Event.SaveShippingClicked',
  CLOSE_EDITION_CLICKED         = 'ShippingOrdersSubmitterComponent.Event.CloseEditionClicked',
  CLOSE_SHIPPING_CLICKED        = 'ShippingOrdersSubmitterComponent.Event.CloseShippingClicked',
  DELETE_SHIPPING_CLICKED       = 'ShippingOrdersSubmitterComponent.Event.DeleteShippingClicked',
  PRINT_SHIPPING_LABELS_CLICKED = 'ShippingOrdersSubmitterComponent.Event.PrintShippingLabelsClicked',
  PRINT_ORDERS_CLICKED          = 'ShippingOrdersSubmitterComponent.Event.PrintOrdersClicked',
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


  onCloseEdition() {
    this.confirmCloseEdition();
  }


  onCloseShipping() {
    this.confirmCloseShipping();
  }


  onDeleteShipping() {
    this.confirmDeleteShipping();
  }


  onPrintShippingLabels() {
    sendEvent(this.shippingOrdersSubmitterEvent,
      ShippingOrdersSubmitterEventType.PRINT_SHIPPING_LABELS_CLICKED);
  }


  onPrintOrders() {
    sendEvent(this.shippingOrdersSubmitterEvent,
      ShippingOrdersSubmitterEventType.PRINT_ORDERS_CLICKED);
  }


  private confirmCloseEdition() {
    const message = `Esta operación pasará a embarque los pedidos seleccionados para su envío con la ` +
      `paquetería <strong> ${this.shippingData.parcelSupplier.name} </strong>. <br><br>¿Envío el pedido?`;

    this.messageBox.confirm(message, 'Enviar a embarque')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.shippingOrdersSubmitterEvent, ShippingOrdersSubmitterEventType.CLOSE_EDITION_CLICKED);
        }
      });
  }


  private confirmCloseShipping() {
    const message = `Esta operación cerrara el embarque <strong>${this.shippingData.shippingID}</strong> ` +
      `y los pedidos contenidos en este embarque. <br><br>¿Cierro el embarque?`;

    this.messageBox.confirm(message, 'Cerrar embarque')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.shippingOrdersSubmitterEvent, ShippingOrdersSubmitterEventType.CLOSE_SHIPPING_CLICKED);
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
