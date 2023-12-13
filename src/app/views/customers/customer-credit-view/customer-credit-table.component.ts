/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { CreditTransaction } from '@app/models';


@Component({
  selector: 'emp-trade-customer-credit-table',
  templateUrl: './customer-credit-table.component.html',
})
export class CustomerCreditTableComponent implements OnChanges {

  @Input() creditTransactions: CreditTransaction[] = [];

  displayedColumns = ['ticketNumber', 'transactionDate', 'creditAmount', 'debitAmount',
                      'dueDate', 'daysToPay'];

  dataSource: MatTableDataSource<CreditTransaction>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.creditTransactions) {
      this.dataSource = new MatTableDataSource(this.creditTransactions);
    }
  }


  get hasItems(): boolean {
    return this.creditTransactions.length > 0;
  }


}
