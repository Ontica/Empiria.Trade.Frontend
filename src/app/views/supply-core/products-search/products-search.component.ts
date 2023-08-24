/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, PresentationState, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateAction, MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { ExportationType, EMPTY_SEARCH_DATA, SEARCH_DATA, ExportationTypeList,
         SearchDataTable } from '@app/models';

import { DataTableEventType } from '../../reports-controls/data-table/data-table.component';

import { ExportReportModalEventType } from '../../reports-controls/export-report-modal/export-report-modal.component';

import { ProductsFilterEventType } from './products-filter.component';

export enum ProductsSearchEventType {
  ENTRY_CLICKED = 'ProductsSearchComponent.Event.EntryClicked',
}

@Component({
  selector: 'emp-ng-products-search',
  templateUrl: './products-search.component.html',
})
export class ProductsSearchComponent implements OnInit, OnDestroy {

  @Input() title = 'Buscador de productos';

  @Input() productSelected = null;

  @Output() productsSearchEvent = new EventEmitter<EventInfo>();

  showFilters = false;

  queryExecuted = false;

  isLoading = false;

  data: SearchDataTable = Object.assign({}, EMPTY_SEARCH_DATA);

  displayExportModal = false;

  exportationTypesList: ExportationType[] = ExportationTypeList;

  excelFileUrl = '';

  hintText = 'Demo';

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              protected state: PresentationState,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.suscribeToViewAction();
    this.setText();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onProductsFilterEvent(event: EventInfo) {
    switch (event.type as ProductsFilterEventType) {

      case ProductsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.searchData(event.payload.query.keywords as string);
        return;

      case ProductsFilterEventType.CLEAR_CLICKED:
        this.clearData();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;

      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.productsSearchEvent, ProductsSearchEventType.ENTRY_CLICKED, event.payload.entry);
        return;

      case DataTableEventType.EXPORT_DATA:
        this.setDisplayExportModal(true);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        this.exportAccountStatementToExcel();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private clearData() {
    this.queryExecuted = false;
    this.data = Object.assign({}, EMPTY_SEARCH_DATA);
    this.setText();
  }


  private searchData(keywords: string) {
    this.queryExecuted = false;
    this.isLoading = true;
    this.data = Object.assign({}, EMPTY_SEARCH_DATA);

    setTimeout(() => {
      this.data = Object.assign({}, SEARCH_DATA);
      this.queryExecuted = true;
      this.isLoading = false;
      this.showFilters = false;
      this.setText();
    }, 2000);
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.excelFileUrl = '';
  }


  private exportAccountStatementToExcel() {
    setTimeout(() => this.excelFileUrl = 'assets/tmp/pdf-test.pdf', 1000);
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.hintText = 'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.hintText = `Demo - ${displayedEntriesMessage}`;
      return;
    }

    this.hintText = `Demo - ${this.data.entries.length} registros encontrados`;
  }


  private suscribeToViewAction() {
    this.helper.select<string>(MainUIStateSelector.VIEW_ACTION)
      .subscribe(action => this.resolveViewAction(action));
  }


  private resetViewAction() {
    this.state.dispatch(MainUIStateAction.SET_VIEW_ACTION_DEFAULT);
  }


  private resolveViewAction(action: string) {
    switch (action) {
      case 'ActionExport':
        this.setDisplayExportModal(true);
        this.resetViewAction();
        return;

      case 'ActionCreate':
        this.messageBox.showInDevelopment('Agregar producto', action);
        this.resetViewAction();
        return;

      default:
        return;
    }
  }

}
