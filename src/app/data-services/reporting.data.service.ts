/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { FileReport, ReportData, ReportGroup, ReportQuery } from '@app/models';


@Injectable()
export class ReportingDataService {

  constructor(private http: HttpService) { }


  getReportData(group: ReportGroup,
                query: ReportQuery): EmpObservable<ReportData> {
    Assertion.assertValue(group, 'group');
    Assertion.assertValue(query, 'query');

    const path = `v4/trade/reporting/${group}/data`;

    return this.http.post<ReportData>(path, query);
  }


  exportReportData(group: ReportGroup,
                   query: ReportQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/trade/reporting/${group}/export`;

    return this.http.post<FileReport>(path, query);
  }

}
