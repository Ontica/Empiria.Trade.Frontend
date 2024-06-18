/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isEmpty } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { Address, Contact, Customer, CustomerSelection, EmptyCustomerSelection,
         buildCustomerSelection } from '@app/models';


@Component({
  selector: 'emp-trade-customer-selector',
  templateUrl: './customer-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomerSelectorComponent),
      multi: true
    },
  ]
})
export class CustomerSelectorComponent implements ControlValueAccessor {

  @Input() editionMode = false;

  @Input() showError = false;

  @Input() initialValue = null;

  @Input() errors = null;

  value: CustomerSelection;

  onChange: (value: CustomerSelection) => void;

  onTouched: () => void;

  disabled: boolean;

  customersWithContactsAPI = SearcherAPIS.customersWithContacts;

  customerSelected = null;

  contactSelected = null;

  AddressSelected = null;

  customerContactsList: Contact[] = [];

  customerAddressesList: Address[] = [];


  get contactsPlaceholder(): string {
    if (!this.editionMode) {
      return 'No definido';
    }

    if (isEmpty(this.value.customer)) {
      return 'Seleccione al cliente';
    }

    return this.value.customer.contacts?.length === 0 ?
      'El cliente no tiene contactos' :
      'Seleccione el contacto';
  }


  get addressesPlaceholder(): string {
    if (!this.editionMode) {
      return 'No definido';
    }

    if (isEmpty(this.value.customer)) {
      return 'Seleccione al cliente';
    }

    return this.value.customer.addresses?.length === 0 ?
      'El cliente no tiene direcciones' :
      'Seleccione la dirección';
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }


  writeValue(value: CustomerSelection) {
    const customer = !value ? EmptyCustomerSelection : value;
    this.setCustomerData(customer);
    this.value = customer;
  }


  onCustomerChanged(customer: Customer) {
    this.customerContactsList = customer?.contacts ?? [];
    this.customerAddressesList = customer?.addresses ?? [];

    this.value.contact = null;
    this.value.address = null;

    this.contactSelected = null;
    this.AddressSelected = null;

    this.onCustomerDataChanged();
  }


  onCustomerDataChanged() {
    const value = buildCustomerSelection(this.customerSelected, this.contactSelected, this.AddressSelected);
    this.onChange(value);
  }



  private setCustomerData(customer: CustomerSelection) {
    this.customerSelected = customer?.customer ?? null;
    this.contactSelected = customer?.contact ?? null;
    this.AddressSelected = customer?.address ?? null;

    const contactsList = this.customerSelected?.contacts;
    const addressesList = this.customerSelected?.addresses;

    this.customerContactsList = isEmpty(this.contactSelected) ? contactsList :
      ArrayLibrary.insertIfNotExist(contactsList ?? [], this.contactSelected, 'uid');
    this.customerAddressesList = isEmpty(this.AddressSelected) ? addressesList :
      ArrayLibrary.insertIfNotExist(addressesList ?? [], this.AddressSelected, 'uid');
  }

}
