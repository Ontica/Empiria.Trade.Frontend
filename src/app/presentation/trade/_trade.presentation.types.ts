/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


/* Actions */

export type TradeActions = '';


/* Commands */

export type TradeCommands = '';


/* Effects */

export type TradeEffects = '';


/* Selectors */

import { SelectorType as CataloguesStateSelector } from './catalogues.presentation.handler';
export { SelectorType as CataloguesStateSelector } from './catalogues.presentation.handler';

import { SelectorType as InventaryStateSelector } from './inventary.presentation.handler';
export { SelectorType as InventaryStateSelector } from './inventary.presentation.handler';

export type TradeSelectors = CataloguesStateSelector |
                             InventaryStateSelector;
