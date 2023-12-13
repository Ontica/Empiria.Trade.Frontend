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

import { CustomerCreditViewComponent } from './customer-credit-view/customer-credit-view.component';
import { CustomerCreditTableComponent } from './customer-credit-view/customer-credit-table.component';
import { CustomerViewComponent } from './customer-credit-view/customer-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    CustomerCreditViewComponent,
    CustomerViewComponent,
    CustomerCreditTableComponent,
  ],
  exports: [
    CustomerCreditViewComponent,
  ],
})
export class CustomersModule { }
