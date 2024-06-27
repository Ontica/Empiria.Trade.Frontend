/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { InventoryDataService, MoneyAccountsDataService } from '@app/data-services';


export enum SelectorType {
  INVENTORY_ORDER_TYPES                = 'Trade.Inventory.Selectors.InventoryOrderTypes.List',
  MONEY_ACCOUNT_TYPES                  = 'Trade.MoneyAccount.Selectors.Types.List',
  MONEY_ACCOUNT_STATUS                 = 'Trade.MoneyAccount.Selectors.Status.List',
  MONEY_ACCOUNT_TRANSACTION_TYPES      = 'Trade.MoneyAccount.Selectors.TransactionTypes.List',
  MONEY_ACCOUNT_PAYMENT_TYPES          = 'Trade.MoneyAccount.Selectors.PaymentTypes.List',
  MONEY_ACCOUNT_TRANSACTION_ITEM_TYPES = 'Trade.MoneyAccount.Selectors.TransactionItemTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.INVENTORY_ORDER_TYPES, value: [] },
  { key: SelectorType.MONEY_ACCOUNT_TYPES, value: [] },
  { key: SelectorType.MONEY_ACCOUNT_STATUS, value: [] },
  { key: SelectorType.MONEY_ACCOUNT_TRANSACTION_TYPES, value: [] },
  { key: SelectorType.MONEY_ACCOUNT_PAYMENT_TYPES, value: [] },
  { key: SelectorType.MONEY_ACCOUNT_TRANSACTION_ITEM_TYPES, value: [] },
];


@Injectable()
export class CataloguesPresentationHandler extends AbstractPresentationHandler {

  constructor(private inventoryData: InventoryDataService,
              private moneyAccountsData: MoneyAccountsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {
    switch (selectorType) {

      case SelectorType.INVENTORY_ORDER_TYPES: {
        const provider = () => this.inventoryData.getOrderTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.MONEY_ACCOUNT_TYPES: {
        const provider = () => this.moneyAccountsData.getMoneyAccountTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.MONEY_ACCOUNT_STATUS: {
        const provider = () => this.moneyAccountsData.getMoneyAccountStatus();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.MONEY_ACCOUNT_TRANSACTION_TYPES: {
        const provider = () => this.moneyAccountsData.getMoneyAccountTransactionTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.MONEY_ACCOUNT_PAYMENT_TYPES: {
        const provider = () => this.moneyAccountsData.getMoneyAccountPaymentTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.MONEY_ACCOUNT_TRANSACTION_ITEM_TYPES: {
        const provider = () => this.moneyAccountsData.getMoneyAccountTransactionItemTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);
    }
  }

}
