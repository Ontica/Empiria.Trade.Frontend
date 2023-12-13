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

import { PackingViewComponent } from './packing-view/packing-view.component';
import { PackingStatusComponent } from './packing-view/packing-status.component';
import { PackingItemsTableComponent } from './packing-view/packing-items-table.component';

import { PackingItemEditorComponent } from './packing-items-edition/packing-item-editor.component';
import { PackingItemEntriesEditorComponent } from './packing-items-edition/packing-item-entries-editor.component';
import { PackingItemEntriesTableComponent } from './packing-items-edition/packing-item-entries-table.component';
import { MissingItemsTableComponent } from './packing-items-edition/missing-items-table.component';
import { MissingItemLocationComponent } from './packing-items-edition/missing-item-location.component';
import { MissingItemsModalComponent } from './packing-view/missing-items-modal.component';

import { ShippingViewComponent } from './shipping-view/shipping-view.component';

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

    ShippingViewComponent,
  ],
  exports: [
    PackingViewComponent,
    ShippingViewComponent,
  ],
})
export class ShippingAndHandlingModule { }
