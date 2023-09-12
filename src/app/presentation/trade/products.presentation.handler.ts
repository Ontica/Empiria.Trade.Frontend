/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';


export enum SelectorType {
  DEFAULT = 'Trade.Products.Selectors.Default',
}


const initialState: StateValues = [

];


@Injectable()
export class ProductsPresentationHandler extends AbstractPresentationHandler {

  constructor() {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {
    switch (selectorType) {

      default:
        return super.select<U>(selectorType, params);
    }
  }

}
