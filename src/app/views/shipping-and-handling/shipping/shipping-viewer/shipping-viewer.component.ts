/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyShippingData, ShippingData } from '@app/models';

import { ShippingEditorEventType } from '../shipping-editor/shipping-editor.component';

export enum ShippingViewerEventType {
  CLOSE_BUTTON_CLICKED = 'ShippingViewerComponent.Event.CloseButtonClicked',
  SHIPPING_UPDATED     = 'ShippingViewerComponent.Event.ShippingUpdated',
}

@Component({
  selector: 'emp-trade-shipping-viewer',
  templateUrl: './shipping-viewer.component.html',
})
export class ShippingViewerComponent {

  @Input() shippingData: ShippingData = EmptyShippingData;

  @Output() shippingViewerEvent = new EventEmitter<EventInfo>();


  onShippingEditorEvent(event: EventInfo) {
    switch (event.type as ShippingEditorEventType) {
      case ShippingEditorEventType.CLOSE_BUTTON_CLICKED:
        sendEvent(this.shippingViewerEvent, ShippingViewerEventType.CLOSE_BUTTON_CLICKED);
        return;

      case ShippingEditorEventType.SHIPPING_UPDATED:
      case ShippingEditorEventType.SHIPPING_SENT:
        sendEvent(this.shippingViewerEvent, ShippingViewerEventType.SHIPPING_UPDATED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
