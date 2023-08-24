/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { MainLayoutActions, MainLayoutSelectors } from './main-layout/_main-layout.presentation.types';
export * from './main-layout/_main-layout.presentation.types';

import { EPActions, EPCommands, EPEffects, EPSelectors } from './empiria/_empiria.presentation.types';
export * from './empiria/_empiria.presentation.types';


/* Exportation types */

export type ActionType = MainLayoutActions | EPActions;

export type CommandType = EPCommands;

export type StateEffect = EPEffects;

export type StateSelector = MainLayoutSelectors | EPSelectors;
