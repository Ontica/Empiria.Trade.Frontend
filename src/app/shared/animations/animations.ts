/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { trigger, transition, animate, style, state} from '@angular/animations';


export const expandCollapse = trigger('expandCollapse', [
  state('*', style({
    'overflow-y': 'hidden',
    'overflow-x': 'hidden',
    'height': '*',
  })),
  state('void', style({
    'height': '0',
    'overflow-y': 'hidden',
    'overflow-x': 'hidden',
  })),
  transition('* => void', animate('150ms ease')),
  transition('void => *', animate('150ms ease'))
]);
