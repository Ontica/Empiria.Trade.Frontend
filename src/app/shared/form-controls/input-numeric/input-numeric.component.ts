/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FormatLibrary } from '@app/shared/utils';


@Component({
  selector: 'emp-ng-input-numeric',
  templateUrl: 'input-numeric.component.html',
  styleUrls: ['input-numeric.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumericComponent),
      multi: true
    },
  ]
})
export class InputNumericComponent implements ControlValueAccessor {

  @Input() id: string;

  @Input() minDecimals = 2;

  @Input() maxDecimals = 2;

  @Input() showError = false;

  @Input() noMargin = false;

  @Output() valueChange = new EventEmitter<number>();

  disabled = false;

  formattedValue = '';

  propagateChange = (_: any) => { };

  propagateTouch = () => { };


  onBlur() {
    this.propagateTouch();
  }

  onInputChange(newValue: string) {
    const numericValue = this.getNumericValue(newValue);
    this.setFormattedValue(numericValue);

    this.propagateChange(numericValue);
    this.valueChange.emit(numericValue);
    this.onBlur();
  }

  writeValue(value: any): void {
    this.setFormattedValue(value);
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }


  registerOnTouched(fn: any) {
    this.propagateTouch = fn;
  }


  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }


  private getNumericValue(value: any) {
    return value === null || value === undefined || value === '' ?
      null :
      parseFloat(FormatLibrary.stringToNumber(value).toFixed(this.maxDecimals));
  }


  private setFormattedValue(value: any) {
    this.formattedValue = value === null || value === undefined || value === '' ?
      null :
      FormatLibrary.numberWithCommas(value, `1.${this.minDecimals}-${this.maxDecimals}`);
  }

}
