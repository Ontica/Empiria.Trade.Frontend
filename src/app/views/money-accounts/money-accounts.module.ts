/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { SharedModule } from '@app/shared/shared.module';

import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { MoneyAccountsMainPageComponent } from './money-accounts-main-page/money-accounts-main-page.component';
import { MoneyAccountsExplorerComponent } from './money-accounts-explorer/money-accounts-explorer.component';
import { MoneyAccountsFilterComponent } from './money-accounts-explorer/money-accounts-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
  ],
  declarations: [
    MoneyAccountsMainPageComponent,
    MoneyAccountsExplorerComponent,
    MoneyAccountsFilterComponent,
  ],
  exports: [
    MoneyAccountsMainPageComponent,
  ],
})
export class MoneyAccountsModule { }
