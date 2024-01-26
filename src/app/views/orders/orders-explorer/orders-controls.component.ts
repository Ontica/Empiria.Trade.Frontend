/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { OrdersOperation, OrdersOperationList } from '@app/models';


export enum OrdersControlsEventType {
  EXECUTE_OPERATION_CLICKED = 'OrdersControlsComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-trade-orders-controls',
  templateUrl: './orders-controls.component.html',
})
export class OrdersControlsComponent {

  @Input() ordersSelected: string[] = [];

  @Output() ordersControlsEvent = new EventEmitter<EventInfo>();

  operationSelected: OrdersOperation = null;

  operationsList: OrdersOperation[] = OrdersOperationList;


  get operationValid() {
    if (isEmpty(this.operationSelected)) {
      return false;
    }

    return true;
  }


  onExecuteOperationClicked() {
    if (this.operationValid) {
      const payload = {
        operation: this.operationSelected,
        ordersUID: this.ordersSelected,
      };

      sendEvent(this.ordersControlsEvent, OrdersControlsEventType.EXECUTE_OPERATION_CLICKED, payload);
    }
  }

}
