/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { InventoryOrdersDataService, WarehouseDataService } from '@app/data-services';


export enum SelectorType {
  INVENTORY_ORDER_TYPES = 'Trade.Products.Selectors.InventoryOrderTypes.List',
  WAREHOUSE_BINS        = 'Trade.Products.Selectors.WarehouseBins.List',
}


const initialState: StateValues = [
  { key: SelectorType.INVENTORY_ORDER_TYPES, value: [] },
  { key: SelectorType.WAREHOUSE_BINS, value: [] },
];


@Injectable()
export class CataloguesPresentationHandler extends AbstractPresentationHandler {

  constructor(private inventoryData: InventoryOrdersDataService,
              private warehouseData: WarehouseDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {
    switch (selectorType) {

      case SelectorType.INVENTORY_ORDER_TYPES: {
        const provider = () => this.inventoryData.getInventoryOrderTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.WAREHOUSE_BINS: {
        const provider = () => this.warehouseData.getWarehouseBinsForInventory();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);
    }
  }

}
