/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, delay, distinctUntilChanged, filter, map, switchMap,
         tap } from 'rxjs/operators';

import { DateString, EventInfo, Identifiable } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { expandCollapse } from '@app/shared/animations/animations';

import { COUNTRY_DATA, EDITORS_DATA, STATUS_DATA, TYPE_DATA } from '@app/models';


export enum ProductsFilterEventType {
  SEARCH_CLICKED = 'ProductsFilterEventType.Event.SearchClicked',
  CLEAR_CLICKED  = 'ProductsFilterEventType.Event.ClearSearchClicked',
}

interface FilterFormModel extends FormGroup<{
  country: FormControl<string>;
  keywords: FormControl<string>;
  type: FormControl<string>;
  date: FormControl<DateString>;
  period: FormControl<string>;
  status: FormControl<string>;
  editor: FormControl<string>;
  number: FormControl<string>;
  store: FormControl<string>;
  disabled: FormControl<boolean>;
}> { }


@Component({
  selector: 'emp-ng-products-filter',
  templateUrl: './products-filter.component.html',
  animations: [expandCollapse],
})
export class ProductsFilterComponent implements OnInit {

  @Input() showFilters: boolean = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() productsFilterEvent = new EventEmitter<EventInfo>();

  form: FilterFormModel;

  formHelper = FormHelper;

  countryList = COUNTRY_DATA;

  typesList = TYPE_DATA;

  statusList = STATUS_DATA;

  isLoading = false;

  editorList$: Observable<Identifiable[]>;
  editorInput$ = new Subject<string>();
  editorLoading = false;
  minTermLength = 4;

  constructor() {
    this.initForm();
  }


  ngOnInit() {
    this.subscribeEditorList();
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onClearFilters() {
    this.form.reset();
    sendEvent(this.productsFilterEvent, ProductsFilterEventType.CLEAR_CLICKED, { query: this.form.value });
  }


  onSearchClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.productsFilterEvent, ProductsFilterEventType.SEARCH_CLICKED, { query: this.form.value });
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      country: ['', Validators.required],
      keywords: [''],
      date: [null],
      period: [null],
      type: [''],
      status: [''],
      number: [''],
      editor: [''],
      store: [''],
      disabled: [false],
    });

    this.formHelper.setDisableControl(this.form.controls.store);
  }


  private subscribeEditorList() {
    this.editorList$ = concat(
      of([]),
      this.editorInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.minTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.editorLoading = true),
        switchMap(keyword =>
          this.getEditors(keyword)
          .pipe(
            delay(2000),
            catchError(() => of([])),
            tap(() => this.editorLoading = false)
        ))
      )
    );
  }


  private getEditors(keyword: string): Observable<Identifiable[]>{
    return of(EDITORS_DATA)
            .pipe(
              map(editors =>
                editors.filter(e => e.uid.toLowerCase().includes(keyword) ||
                                    e.name.toLowerCase().includes(keyword))
              ),
              delay(500)
            );
  }

}
