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

import { PackingViewComponent } from './packing/packing-view/packing-view.component';
import { PackingStatusComponent } from './packing/packing-view/packing-status.component';
import { PackingItemsTableComponent } from './packing/packing-view/packing-items-table.component';

import { PackingItemEditorComponent } from './packing/packing-items-edition/packing-item-editor.component';
import { PackingItemEntriesEditorComponent } from './packing/packing-items-edition/packing-item-entries-editor.component';
import { PackingItemEntriesTableComponent } from './packing/packing-items-edition/packing-item-entries-table.component';
import { MissingItemsTableComponent } from './packing/packing-items-edition/missing-items-table.component';
import { MissingItemLocationComponent } from './packing/packing-items-edition/missing-item-location.component';
import { MissingItemsModalComponent } from './packing/packing-view/missing-items-modal.component';

import { OrderShippingViewerComponent } from './shipping/order-shipping-viewer/order-shipping-viewer.component';
import { ShippingEditorComponent } from './shipping/shipping-editor/shipping-editor.component';
import { ShippingDataViewComponent } from './shipping/shipping-edition/shipping-data-view.component';
import { ShippingOrdersResumeComponent } from './shipping/shipping-edition/shipping-orders-resume.component';
import { ShippingOrdersTableComponent } from './shipping/shipping-edition/shipping-orders-table.component';
import { ShippingPalletsTableComponent } from './shipping/shipping-edition/shipping-pallets-table.component';
import { ShippingOrdersModalComponent } from './shipping/shipping-edition/shipping-orders-modal.component';
import { ShippingOrdersSubmitterComponent } from './shipping/shipping-edition/shipping-orders-submitter.component';
import { ShippingPalletModalComponent } from './shipping/shipping-edition/shipping-pallet-modal.component';

import { ShippingExplorerComponent } from './shipping/shipping-explorer/shipping-explorer.component';
import { ShippingFilterComponent } from './shipping/shipping-explorer/shipping-filter.component';
import { ShippingTableComponent } from './shipping/shipping-explorer/shipping-table.component';

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,

    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,

    ProductsModule,
  ],
  declarations: [
    PackingViewComponent,
    PackingStatusComponent,
    PackingItemsTableComponent,
    PackingItemEditorComponent,
    PackingItemEntriesEditorComponent,
    PackingItemEntriesTableComponent,
    MissingItemsTableComponent,
    MissingItemLocationComponent,
    MissingItemsModalComponent,

    OrderShippingViewerComponent,
    ShippingEditorComponent,
    ShippingDataViewComponent,
    ShippingOrdersResumeComponent,
    ShippingOrdersTableComponent,
    ShippingPalletsTableComponent,
    ShippingOrdersModalComponent,
    ShippingOrdersSubmitterComponent,
    ShippingPalletModalComponent,

    ShippingExplorerComponent,
    ShippingFilterComponent,
    ShippingTableComponent,
  ],
  exports: [
    PackingViewComponent,
    OrderShippingViewerComponent,
    ShippingEditorComponent,
    ShippingExplorerComponent,
  ],
})
export class ShippingAndHandlingModule { }
