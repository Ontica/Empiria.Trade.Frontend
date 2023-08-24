/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { ProjectDataService } from '@app/data-services';


export enum ActionType {
  SELECT = 'Empiria.SystemManagement.Action.Select',
}


export enum SelectorType {
  DEFAULT = 'Empiria.SystemManagement.Selectors.Default',
}


const initialState: StateValues = [

];


@Injectable()
export class SystemManagementPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: ProjectDataService) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {
    switch (selectorType) {

      default:
        return super.select<U>(selectorType, params);
    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
