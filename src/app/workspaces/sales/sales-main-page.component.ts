/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { EventInfo } from '@app/core';

import { SearchEntry } from '@app/models';

import { ProductsSearchEventType } from '@app/views/supply-core/products-search/products-search.component';


@Component({
  selector: 'emp-ng-sales-main-page',
  templateUrl: './sales-main-page.component.html',
})
export class SalesMainPageComponent {

  displaySecondaryView = false;

  entrySelected: SearchEntry = null;


  onEntrySearchEvent(event: EventInfo) {
    switch (event.type as ProductsSearchEventType) {
      case ProductsSearchEventType.ENTRY_CLICKED:
        this.setEntrySelected(event.payload as SearchEntry);
        break;

      default:
        break;
    }
  }


  onCloseSecondaryView() {
    this.setEntrySelected(null);
  }


  private setEntrySelected(entry: SearchEntry) {
    this.entrySelected = entry;
    this.displaySecondaryView = this.entrySelected !== null;
  }

}
