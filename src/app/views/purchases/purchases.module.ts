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

import { OrdersModule } from '../orders/orders.module';

import { PurchaseOrdersMainPageComponent } from './purchase-orders-main-page/purchase-orders-main-page.component';
import { PurchaseOrdersFilterComponent } from './purchase-orders-filter/purchase-orders-filter.component';
import { PurchaseOrderHeaderComponent } from './purchase-order/purchase-order-header.component';
import { PurchaseOrderCreatorComponent } from './purchase-order/purchase-order-creator.component';
import { PurchaseOrderEditorComponent } from './purchase-order/purchase-order-editor.component';
import { PurchaseOrderTabbedViewComponent } from './purchase-order-tabbed-view/purchase-order-tabbed-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,

    OrdersModule,
  ],
  declarations: [
    PurchaseOrdersMainPageComponent,
    PurchaseOrdersFilterComponent,
    PurchaseOrderHeaderComponent,
    PurchaseOrderCreatorComponent,
    PurchaseOrderEditorComponent,
    PurchaseOrderTabbedViewComponent,
  ],
  exports: [
    PurchaseOrdersMainPageComponent,
  ]
})
export class PurchasesModule { }
