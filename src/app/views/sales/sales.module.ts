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

import { OrdersModule } from '../orders/orders.module';
import { ShippingAndHandlingModule } from '../shipping-and-handling/shipping-and-handling.module';

import { SalesOrdersMainPageComponent } from './sales-orders-main-page/sales-orders-main-page.component';
import { SalesOrdersFilterComponent } from './sales-orders-filter/sales-orders-filter.component';
import { SaleOrderCreatorComponent } from './sale-order/sale-order-creator.component';
import { SaleOrderEditorComponent } from './sale-order/sale-order-editor.component';
import { SaleOrderTabbedViewComponent } from './sale-order-tabbed-view/sale-order-tabbed-view.component';
import { SaleOrderEditionComponent } from './sale-order-edition/sale-order-edition.component';
import { SaleOrderHeaderComponent } from './sale-order-edition/sale-order-header.component';
import { SaleOrderItemsComponent } from './sale-order-edition/sale-order-items.component';
import { SaleOrderSummaryComponent } from './sale-order-edition/sale-order-summary.component';
import { SaleOrderAdditionalDataComponent } from './sale-order-edition/sale-order-additional-data.component';
import { SaleOrderTotalsComponent } from './sale-order-edition/sale-order-totals.component';
import { SaleOrderSubmitterComponent } from './sale-order-edition/sale-order-submitter.component';
import { SaleOrderConfirmSubmitModalComponent } from './sale-order-edition/sale-order-confirm-submit-modal.component';
import { SaleOrderProductSelectorComponent } from './sale-order-product-selector/sale-order-product-selector.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,

    CustomersModule,
    OrdersModule,
    ProductsModule,
    ShippingAndHandlingModule,
  ],
  declarations: [
    SalesOrdersMainPageComponent,
    SalesOrdersFilterComponent,
    SaleOrderCreatorComponent,
    SaleOrderEditorComponent,
    SaleOrderTabbedViewComponent,
    SaleOrderEditionComponent,
    SaleOrderHeaderComponent,
    SaleOrderItemsComponent,
    SaleOrderSummaryComponent,
    SaleOrderAdditionalDataComponent,
    SaleOrderTotalsComponent,
    SaleOrderSubmitterComponent,
    SaleOrderConfirmSubmitModalComponent,
    SaleOrderProductSelectorComponent,
  ],
  exports: [
    SalesOrdersMainPageComponent,
  ]
})
export class SalesModule { }
