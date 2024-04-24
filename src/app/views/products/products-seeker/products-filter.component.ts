/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { ProductQuery } from '@app/models';


export enum ProductsFilterEventType {
  SEARCH_CLICKED = 'ProductsFilterEventType.Event.SearchClicked',
  CLEAR_CLICKED  = 'ProductsFilterEventType.Event.ClearSearchClicked',
}

interface ProductsFilterFormModel extends FormGroup<{
  keywords: FormControl<string>;
  onStock: FormControl<boolean>;
}> { }


@Component({
  selector: 'emp-trade-products-filter',
  templateUrl: './products-filter.component.html',
})
export class ProductsFilterComponent implements AfterViewInit {

  @ViewChild("inputKeywords") inputKeywordsField: ElementRef;

  @Output() productsFilterEvent = new EventEmitter<EventInfo>();

  form: ProductsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;


  constructor() {
    this.initForm();
  }


  ngAfterViewInit() {
    this.inputKeywordsField.nativeElement.focus();
  }


  onClearClicked() {
    this.form.reset();
    // sendEvent(this.productsFilterEvent, ProductsFilterEventType.CLEAR_CLICKED, { query: this.form.value });
  }


  onSearchClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.productsFilterEvent, ProductsFilterEventType.SEARCH_CLICKED,
        { query: this.getProductQuery() });
    }
  }


  clearFilters() {
    this.form.controls.keywords.reset();
    this.inputKeywordsField.nativeElement.focus();
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      keywords: ['', Validators.required],
      onStock: [true],
    });
  }


  private getProductQuery(): ProductQuery {
    const query: ProductQuery = {
      keywords: this.form.value.keywords,
      onStock: this.form.value.onStock,
    };

    return query;
  }

}
