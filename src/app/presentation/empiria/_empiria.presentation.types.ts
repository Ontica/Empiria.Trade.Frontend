/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


/* Actions */

import { ActionType as SystemManagementAction } from './system-management.presentation.handler';
export { ActionType as SystemManagementAction } from './system-management.presentation.handler';

export type EPActions = SystemManagementAction;


/* Commands */

export type EPCommands = '';


/* Effects */

export type EPEffects = '';


/* Selectors */

import { SelectorType as SystemManagemenStateSelector } from './system-management.presentation.handler';
export { SelectorType as SystemManagemenStateSelector } from './system-management.presentation.handler';

export type EPSelectors = SystemManagemenStateSelector;
