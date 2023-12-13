/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';

import { SharedContainersModule } from './containers/shared-containers.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { SharedFormControlsModule } from './form-controls/shared-form-controls.module';
import { SharedIndicatorsModule } from './indicators/shared-indicators.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { PrinterService } from './utils/printer.service';

import { DefaultComponent } from './components/default-component/default.component';
import { GalleryComponent } from './components/gallery/gallery.component';


@NgModule({

  imports: [
    CommonModule,

    SharedContainersModule,
    SharedDirectivesModule,
    SharedFormControlsModule,
    SharedIndicatorsModule,
    SharedPipesModule,
  ],

  declarations: [
    DefaultComponent,
    GalleryComponent,
  ],

  exports: [
    SharedContainersModule,
    SharedDirectivesModule,
    SharedFormControlsModule,
    SharedIndicatorsModule,
    SharedPipesModule,

    DefaultComponent,
    GalleryComponent,
  ],

  providers: [
    CurrencyPipe,
    DecimalPipe,
    PrinterService,
  ]

})
export class SharedModule { }
