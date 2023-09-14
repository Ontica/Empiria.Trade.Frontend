/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { FileDownloadService } from './file-services/file-download.service';

import { getSaver, SAVER } from './file-services/saver.provider';

import { AccessControlDataService } from './_access-control.data.service';

import { ProductsDataService } from './products.data.service';


@NgModule({

  providers: [
    FileDownloadService,
    AccessControlDataService,
    ProductsDataService,

    { provide: SAVER, useFactory: getSaver }
  ]

})
export class DataServicesModule { }
