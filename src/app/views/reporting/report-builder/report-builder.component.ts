/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EmpObservable, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/services';

import { ReportingDataService } from '@app/data-services';

import { FileType, ReportGroup, ReportQuery, ReportType, ReportData, EmptyReportData,
         EmptyReportType, ExportationType, DefaultExportationTypesList, FileReport } from '@app/models';

import { ReportViewerEventType } from './report-viewer.component';

import { InventoryReportFilterEventType } from './reports-filters/inventory-report-filter.component';


@Component({
  selector: 'emp-trade-report-builder',
  templateUrl: './report-builder.component.html',
})
export class ReportBuilderComponent implements OnInit, OnDestroy {

  ReportGroups = ReportGroup;

  reportGroup: ReportGroup;

  isLoading = false;

  queryExecuted = false;

  reportQuery: ReportQuery = Object.assign({});

  selectedReportType: ReportType = EmptyReportType;

  reportData: ReportData = Object.assign({}, EmptyReportData);

  exportationTypesList: ExportationType[] = DefaultExportationTypesList;

  fileUrl = '';

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private reportingData: ReportingDataService,
              private messageBox: MessageBoxService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.setReportGroupFromCurrentView();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  onReportFilterEvent(event: EventInfo) {
    if (this.isLoading) {
      return;
    }

    switch (event.type as InventoryReportFilterEventType) {
      case InventoryReportFilterEventType.BUILD_REPORT_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');

        this.setReportQuery(event.payload.query as ReportQuery);
        this.setReportType(event.payload.reportType as ReportType);
        this.validateGetReportData();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onReportViewerEvent(event: EventInfo) {
    switch (event.type as ReportViewerEventType) {
      case ReportViewerEventType.EXPORT_DATA_CLICKED:
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');
        const reportQuery = this.getReportQueryForExport(event.payload.exportationType as FileType);
        this.validateExportReportData(reportQuery);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setReportGroupFromCurrentView() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));
  }


  private onCurrentViewChanged(newView: View) {
    switch (newView.name) {
      case 'AlmacenesViews.Reportes':
        this.reportGroup = ReportGroup.Inventory;
        return;

      default:
        this.reportGroup = null;
        return;
    }
  }


  private validateGetReportData() {
    this.clearReportData();
    this.setTmpData();

    // let observable: EmpObservable<ReportData> = this.reportingData.getReportData(this.reportGroup,
    //                                                                              this.reportQuery);
    // this.getReportData(observable);
  }


  private validateExportReportData(reportQuery: ReportQuery) {
    this.setTmpExportData();

    // let observable: EmpObservable<FileReport> = this.reportingData.exportReportData(this.reportGroup,
    //                                                                                 reportQuery);
    // this.exportReportData(observable);
  }


  private getReportData(observable: EmpObservable<ReportData>) {
    this.isLoading = true;

    observable
      .firstValue()
      .then(x => this.setReportData(x))
      .finally(() => this.isLoading = false);
  }


  private exportReportData(observable: EmpObservable<FileReport>) {
    observable
      .firstValue()
      .then(x => this.fileUrl = x.url);
  }


  private setReportQuery(query: ReportQuery) {
    this.reportQuery = query;
  }


  private setReportType(reportType: ReportType) {
    this.selectedReportType = reportType;
  }


  private setReportData(reportData: ReportData, queryExecuted = true) {
    this.reportData = reportData;
    this.queryExecuted = queryExecuted;
  }


  private clearReportData() {
    this.setReportData(EmptyReportData, false);
  }


  private getReportQueryForExport(exportTo: FileType): ReportQuery {
    return Object.assign({}, this.reportQuery, { exportTo });
  }


  private setTmpData() {
    this.isLoading = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment(`Generar reporte (${this.selectedReportType.name})`,
        { group: this.reportGroup, reportType: this.selectedReportType, query: this.reportQuery });
      this.setReportData(EmptyReportData);
      this.isLoading = false;
    }, 500);
  }


  private setTmpExportData() {
    setTimeout(() => {
      this.messageBox.showInDevelopment(`Exportar reporte (${this.selectedReportType.name})`,
        { group: this.reportGroup, reportType: this.selectedReportType, query: this.reportQuery });
      this.fileUrl = 'Tmp data';
    }, 500);
  }

}
