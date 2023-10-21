/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ProductQuery } from '@app/models';


export enum ProductsFilterEventType {
  SEARCH_CLICKED = 'ProductsFilterEventType.Event.SearchClicked',
  CLEAR_CLICKED  = 'ProductsFilterEventType.Event.ClearSearchClicked',
}

interface ProductsFilterFormModel extends FormGroup<{
  keywords: FormControl<string>;
}> { }


@Component({
  selector: 'emp-trade-products-filter',
  templateUrl: './products-filter.component.html',
})
export class ProductsFilterComponent implements OnDestroy {

  @Output() productsFilterEvent = new EventEmitter<EventInfo>();

  form: ProductsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.initForm();
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  onClearFilters() {
    this.form.reset();
    sendEvent(this.productsFilterEvent, ProductsFilterEventType.CLEAR_CLICKED, { query: this.form.value });
  }


  onSearchClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.productsFilterEvent, ProductsFilterEventType.SEARCH_CLICKED,
        { query: this.getProductQuery() });
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({ keywords: ['', Validators.required] });
  }


  private getProductQuery(): ProductQuery {
    const query: ProductQuery = {
      keywords: this.form.value.keywords,
    };

    return query;
  }

}
