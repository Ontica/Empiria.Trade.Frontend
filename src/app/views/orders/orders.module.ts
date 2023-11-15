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

import { ReportsControlsModule } from '../reports-controls/reports-controls.module';
import { InventoryModule } from '../inventory/inventory.module';

import { OrderEditionComponent } from './order-edition/order-edition.component';
import { OrderHeaderComponent } from './order-edition/order-header.component';
import { OrderItemsComponent } from './order-edition/order-items.component';
import { OrderSummaryComponent } from './order-edition/order-summary.component';
import { OrderAdditionalDataComponent } from './order-edition/order-additional-data.component';
import { OrderTotalsComponent } from './order-edition/order-totals.component';
import { OrderSubmitterComponent } from './order-edition/order-submitter.component';

import { OrdersListingComponent } from './orders-listing/orders-listing.component';
import { OrdersFilterComponent } from './orders-listing/orders-filter.component';
import { OrdersTableComponent } from './orders-listing/orders-table.component';

import { OrderCreatorComponent } from './order-creator/order-creator.component';
import { OrderTabbedViewComponent } from './order-tabbed-view/order-tabbed-view.component';
import { OrderEditorComponent } from './order-editor/order-editor.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
    InventoryModule,
  ],
  declarations: [
    OrderEditionComponent,
    OrderHeaderComponent,
    OrderItemsComponent,
    OrderSummaryComponent,
    OrderAdditionalDataComponent,
    OrderTotalsComponent,
    OrderSubmitterComponent,

    OrdersListingComponent,
    OrdersFilterComponent,
    OrdersTableComponent,

    OrderCreatorComponent,
    OrderTabbedViewComponent,
    OrderEditorComponent,
  ],
  exports: [
    OrderCreatorComponent,
    OrdersListingComponent,
    OrderTabbedViewComponent,
  ],
})
export class OrdersModule { }
