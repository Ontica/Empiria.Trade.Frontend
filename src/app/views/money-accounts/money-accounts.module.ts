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
import { MoneyAccountTabbedViewComponent } from './money-account-tabbed-view/money-account-tabbed-view.component';
import { MoneyAccountHeaderComponent } from './money-account/money-account-header.component';
import { MoneyAccountCreatorComponent } from './money-account/money-account-creator.component';
import { MoneyAccountEditorComponent } from './money-account/money-account-editor.component';
import { MoneyAccountTransactionsEditionComponent } from './money-account-transactions/money-account-transactions-edition.component';
import { MoneyAccountTransactionsTableComponent } from './money-account-transactions/money-account-transactions-table.component'
import { MoneyAccountTransactionEditorComponent } from './money-account-transaction/money-account-transaction-editor.component';
import { MoneyAccountTransactionItemsTableComponent } from './money-account-transaction/money-account-transaction-items-table.component';
import { MoneyAccountTransactionItemEditorComponent } from './money-account-transaction/money-account-transaction-item-editor.component';

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
    MoneyAccountTabbedViewComponent,
    MoneyAccountHeaderComponent,
    MoneyAccountCreatorComponent,
    MoneyAccountEditorComponent,
    MoneyAccountTransactionsEditionComponent,
    MoneyAccountTransactionsTableComponent,
    MoneyAccountTransactionEditorComponent,
    MoneyAccountTransactionItemsTableComponent,
    MoneyAccountTransactionItemEditorComponent,
  ],
  exports: [
    MoneyAccountsMainPageComponent,
  ],
})
export class MoneyAccountsModule { }
