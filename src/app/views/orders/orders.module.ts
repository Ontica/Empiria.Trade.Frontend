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

import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';
import { ShippingAndHandlingModule } from '../shipping-and-handling/shipping-and-handling.module';

import { OrderEditionComponent } from './order-edition/order-edition.component';
import { OrderHeaderComponent } from './order-edition/order-header.component';
import { OrderItemsComponent } from './order-edition/order-items.component';
import { OrderSummaryComponent } from './order-edition/order-summary.component';
import { OrderAdditionalDataComponent } from './order-edition/order-additional-data.component';
import { OrderTotalsComponent } from './order-edition/order-totals.component';
import { OrderSubmitterComponent } from './order-edition/order-submitter.component';
import { OrderConfirmSubmitModalComponent } from './order-edition/order-confirm-submit-modal.component';

import { OrdersExplorerComponent } from './orders-explorer/orders-explorer.component';
import { OrdersFilterComponent } from './orders-explorer/orders-filter.component';
import { OrdersControlsComponent } from './orders-explorer/orders-controls.component';

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

    CustomersModule,
    ProductsModule,
    ReportsControlsModule,
    ShippingAndHandlingModule,
  ],
  declarations: [
    OrderEditionComponent,
    OrderHeaderComponent,
    OrderItemsComponent,
    OrderSummaryComponent,
    OrderAdditionalDataComponent,
    OrderTotalsComponent,
    OrderSubmitterComponent,
    OrderConfirmSubmitModalComponent,

    OrdersExplorerComponent,
    OrdersFilterComponent,
    OrdersControlsComponent,

    OrderCreatorComponent,
    OrderTabbedViewComponent,
    OrderEditorComponent,
  ],
  exports: [
    OrderCreatorComponent,
    OrdersExplorerComponent,
    OrderTabbedViewComponent,
  ],
})
export class OrdersModule { }
