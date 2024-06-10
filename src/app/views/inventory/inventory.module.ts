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

import { ProductsModule } from '../products/products.module';
import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { InventoryOrdersExplorerComponent } from './inventory-orders-explorer/inventory-orders-explorer.component';
import { InventoryOrdersFilterComponent } from './inventory-orders-explorer/inventory-orders-filter.component';
import { InventoryOrderCreatorComponent } from './inventory-order/inventory-order-creator.component';
import { InventoryOrderEditorComponent } from './inventory-order/inventory-order-editor.component';
import { InventoryOrderHeaderComponent } from './inventory-order/inventory-order-header.component';
import { InventoryOrderTabbedViewComponent } from './inventory-order-tabbed-view/inventory-order-tabbed-view.component';
import { InventoryOrderItemsEditionComponent } from './inventory-order-items/inventory-order-items-edition.component';
import { InventoryOrderItemsTableComponent } from './inventory-order-items/inventory-order-items-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ProductsModule,
    ReportsControlsModule,
  ],
  declarations: [
    InventoryOrdersExplorerComponent,
    InventoryOrdersFilterComponent,
    InventoryOrderCreatorComponent,
    InventoryOrderEditorComponent,
    InventoryOrderHeaderComponent,
    InventoryOrderTabbedViewComponent,
    InventoryOrderItemsEditionComponent,
    InventoryOrderItemsTableComponent,
  ],
  exports: [
    InventoryOrdersExplorerComponent,
    InventoryOrderCreatorComponent,
    InventoryOrderTabbedViewComponent,
    InventoryOrderHeaderComponent,
  ],
})
export class InventoryModule { }
