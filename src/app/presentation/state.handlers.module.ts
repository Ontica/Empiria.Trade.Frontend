/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { STATE_HANDLERS } from '@app/core/presentation/presentation.state';

import { MainLayoutPresentationHandler } from './main-layout/main-layout.presentation.handler';

import { AccessControlPresentationHandler } from './security-management/access-control.presentation.handler';

import { ProductsPresentationHandler } from './trade/products.presentation.handler';

@NgModule({

  providers: [
    MainLayoutPresentationHandler,
    AccessControlPresentationHandler,
    ProductsPresentationHandler,

    { provide: STATE_HANDLERS, useExisting: MainLayoutPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: AccessControlPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: ProductsPresentationHandler, multi: true },
  ]

})
export class StateHandlersModule { }
