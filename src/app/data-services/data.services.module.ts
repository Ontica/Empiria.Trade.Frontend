/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { AccessControlDataService } from './_access-control.data.service';

import { SearcherDataService } from './_searcher.data.service';

import { ContactsDataService } from './contacts.data.service';

import { InventoryOrdersDataService } from './inventory-orders.data.service';

import { MoneyAccountsDataService } from './money-accounts.data.service';

import { PackingDataService } from './packing.data.service';

import { ProductsDataService } from './products.data.service';

import { SalesOrdersDataService } from './sales-orders.data.service';

import { ShippingDataService } from './shipping-data.service';


@NgModule({

  providers: [
    AccessControlDataService,
    SearcherDataService,
    ContactsDataService,
    InventoryOrdersDataService,
    MoneyAccountsDataService,
    PackingDataService,
    ProductsDataService,
    SalesOrdersDataService,
    ShippingDataService,
  ]

})
export class DataServicesModule { }
