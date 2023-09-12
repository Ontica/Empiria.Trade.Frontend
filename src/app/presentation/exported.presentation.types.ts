/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { MainLayoutActions, MainLayoutSelectors } from './main-layout/_main-layout.presentation.types';
export * from './main-layout/_main-layout.presentation.types';

import { SMSelectors } from './security-management/_security.management.presentation.types';
export * from './security-management/_security.management.presentation.types';

import { TradeActions, TradeCommands, TradeEffects, TradeSelectors } from './trade/_trade.presentation.types';
export * from './trade/_trade.presentation.types';


/* Exportation types */

export type ActionType = MainLayoutActions | TradeActions;

export type CommandType = TradeCommands;

export type StateEffect = TradeEffects;

export type StateSelector = MainLayoutSelectors | SMSelectors | TradeSelectors;
