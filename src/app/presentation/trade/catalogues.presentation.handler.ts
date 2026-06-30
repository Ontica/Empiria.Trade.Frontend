/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { CataloguesDataService } from '@app/data-services';


export enum SelectorType {
  CURRENCIES = 'Trade.Catalogues.Selector.Currencies.List',
}


const initialState: StateValues = [
  { key: SelectorType.CURRENCIES, value: [] },
];


@Injectable()
export class CataloguesPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: CataloguesDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {
    switch (selectorType) {

      case SelectorType.CURRENCIES: {
        const provider = () => this.data.getCurrencies();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);
    }
  }

}
