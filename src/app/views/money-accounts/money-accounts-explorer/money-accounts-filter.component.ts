/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { MoneyAccountQuery } from '@app/models';

export enum MoneyAccountsFilterEventType {
  SEARCH_CLICKED = 'MoneyAccountsFilterComponent.Event.SearchClicked',
}

interface MoneyAccountsFilterFormModel extends FormGroup<{
  moneyAccountTypeUID: FormControl<string>;
  status: FormControl<string>;
  keywords: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-money-accounts-filter',
  templateUrl: './money-accounts-filter.component.html',
})
export class MoneyAccountsFilterComponent implements OnInit, OnDestroy {

  @Input() queryExecuted: boolean = false;

  @Output() moneyAccountsFilterEvent = new EventEmitter<EventInfo>();

  form: MoneyAccountsFilterFormModel;

  formHelper = FormHelper;

  moneyAccountTypesList: Identifiable[] = [];

  statusList: Identifiable[] = [];

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onSearchClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        isFormValid: this.form.valid,
        query: this.getFormData(),
      };

      sendEvent(this.moneyAccountsFilterEvent, MoneyAccountsFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      moneyAccountTypeUID: ['', Validators.required],
      status: [''],
      keywords: [''],
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.MONEY_ACCOUNT_TYPES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.MONEY_ACCOUNT_STATUS),
    ])
    .subscribe(([x, y]) => {
      this.moneyAccountTypesList = x;
      this.statusList = y;
      this.isLoading = false;
    });
  }


  private getFormData(): MoneyAccountQuery {
    const query: MoneyAccountQuery = {
      moneyAccountTypeUID: this.form.value.moneyAccountTypeUID ?? '',
      status: this.form.value.status ?? '',
      keywords: this.form.value.keywords ?? '',
    };

    return query;
  }

}
