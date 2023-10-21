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

import { SalesModule } from '@app/views/sales/sales.module';
import { InventoryModule } from '@app/views/inventory/inventory.module';

import { SalesWorkspaceRoutingModule } from './sales-workspace-routing.module';
import { SalesMainPageComponent } from './sales-main-page.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,

    SalesModule,
    InventoryModule,

    SalesWorkspaceRoutingModule,
  ],

  declarations: [
    SalesMainPageComponent,
  ],

  exports: [

  ]

})
export class SalesWorkspaceModule { }
