/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyPackagingTotals, PackagingTotals } from '@app/models';

export enum PackagingResumeEventType {
  SHOW_DETAIL_CLICKED = 'PackagingResumeComponent.Event.ShowDetailClicked',
}

@Component({
  selector: 'emp-trade-packaging-resume',
  templateUrl: './packaging-resume.component.html',
})
export class PackagingResumeComponent {

  @Input() totals: PackagingTotals = {...{}, ...EmptyPackagingTotals};

  @Input() showOrdersTotals: boolean = true;

  @Output() packagingResumeEvent = new EventEmitter<EventInfo>();


  onShowDetailClicked() {
    sendEvent(this.packagingResumeEvent, PackagingResumeEventType.SHOW_DETAIL_CLICKED);
  }

}
