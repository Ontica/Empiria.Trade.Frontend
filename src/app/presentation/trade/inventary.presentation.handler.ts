/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { InventoryDataService } from '@app/data-services';


export enum SelectorType {
  INVENTORY_TYPES = 'Trade.Inventory.Selectors.InventoryTypes.List',
  WAREHOUSES      = 'Trade.Inventory.Selectors.wareHouses.List',
  WAREHOUSEMEN    = 'Trade.Inventory.Selectors.Warehousemen.List',
  SUPERVISORS     = 'Trade.Inventory.Selectors.Supervisors.List',
}


const initialState: StateValues = [
  { key: SelectorType.INVENTORY_TYPES, value: [] },
  { key: SelectorType.WAREHOUSES, value: [] },
  { key: SelectorType.WAREHOUSEMEN, value: [] },
  { key: SelectorType.SUPERVISORS, value: [] },
];


@Injectable()
export class InventaryPresentationHandler extends AbstractPresentationHandler {

  constructor(private inventoryData: InventoryDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {
    switch (selectorType) {

      case SelectorType.INVENTORY_TYPES: {
        const provider = () => this.inventoryData.getOrderTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.WAREHOUSES: {
        const provider = () => this.inventoryData.getWareHouses();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.WAREHOUSEMEN: {
        const provider = () => this.inventoryData.getWarehousemen();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.SUPERVISORS: {
        const provider = () => this.inventoryData.getSupervisors();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);
    }
  }

}
