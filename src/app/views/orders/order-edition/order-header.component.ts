/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { DateString, DateStringLibrary, EventInfo, Identifiable, isEmpty } from '@app/core';

import { ContactsDataService, SalesOrdersDataService, SearcherAPIS } from '@app/data-services';

import { Address, Contact, Customer, DefaultOrderStatus, EmptyOrderGeneralData, OrderGeneralData, Party,
         PaymentConditionList, ShippingMethodList, ShippingMethodTypes } from '@app/models';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';


export enum OrderHeaderEventType {
  CHANGE_DATA = 'OrderHeaderComponent.Event.ChangeData',
}

interface OrderFormModel extends FormGroup<{
  orderNumber: FormControl<string>;
  orderTime: FormControl<DateString>;
  status: FormControl<string>;
  priceList: FormControl<string>;
  supplier: FormControl<Party>;
  salesAgent: FormControl<Party>;
  paymentCondition: FormControl<string>;
  shippingMethod: FormControl<string>;
  customer: FormControl<Customer>;
  customerContact: FormControl<Contact>;
  customerAddress: FormControl<Address>;
}> { }

@Component({
  selector: 'emp-trade-order-header',
  templateUrl: './order-header.component.html',
})
export class OrderHeaderComponent implements OnChanges, OnInit {

  @Input() orderData: OrderGeneralData = EmptyOrderGeneralData;

  @Input() editionMode = false;

  @Input() isSaved = false;

  @Output() orderHeaderEvent = new EventEmitter<EventInfo>();

  form: OrderFormModel;

  formHelper = FormHelper;

  isLoadingDataList = false;

  isChangeEmission = false;

  statusList: Identifiable[] = [];

  shippingMethodList: Identifiable[] = ShippingMethodList;

  paymentConditionList: Identifiable[] = PaymentConditionList;

  salesAgentsList: Party[] = [];

  suppliersList: Party[] = [];

  customerContactsList: Contact[] = [];

  customerAddressesList: Address[] = [];

  customersWithContactsAPI = SearcherAPIS.customersWithContacts;


  constructor(private contactsData: ContactsDataService,
              private ordersData: SalesOrdersDataService) {
    this.initForm();
    this.validateEditionMode();
  }


  ngOnInit() {
    this.loadDataList();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderData) {
      this.setFormData();
    }

    if (changes.editionMode) {
      this.validateEditionMode();
    }
  }


  get shippingRequired(): boolean {
    return [ShippingMethodTypes.RutaForanea,
            ShippingMethodTypes.RutaLocal,
            ShippingMethodTypes.Paqueteria,
            ShippingMethodTypes.Ocurre].includes(this.form.value.shippingMethod as ShippingMethodTypes);
  }


  get contactsPlaceholder(): string {
    if (!this.editionMode) {
      return 'No definido';
    }

    if (this.form.controls.customer.invalid) {
      return 'Seleccione al cliente';
    }

    return this.form.value.customer.contacts?.length === 0 ?
      'El cliente no tiene contactos' :
      'Seleccione el contacto';
  }


  get addressesPlaceholder(): string {
    if (!this.editionMode) {
      return 'No definido';
    }

    if (this.form.controls.customer.invalid) {
      return 'Seleccione al cliente';
    }

    return this.form.value.customer.addresses?.length === 0 ?
      'El cliente no tiene direcciones' :
      'Seleccione la dirección';
  }


  onShippingMethodChange() {
    this.validateCustomerAddressRequired();
    this.emitFormChanges();
  }


  onCustomertChange() {
    this.resetCustomerData();
  }


  invalidateForm() {
    FormHelper.markFormControlsAsTouched(this.form);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      orderNumber: [''],
      orderTime: [DateStringLibrary.today(), Validators.required],
      status: [DefaultOrderStatus, Validators.required],
      priceList: ['', Validators.required],
      supplier: [null as Party, Validators.required],
      salesAgent: [null as Party, Validators.required],
      paymentCondition: ['', Validators.required],
      shippingMethod: ['', Validators.required],
      customer: [null as Customer, Validators.required],
      customerContact: [null],
      customerAddress: [null as Address, Validators.required],
    });

    this.form.valueChanges.subscribe(v => this.emitFormChanges());
  }


  private emitFormChanges() {
    if (this.isChangeEmission) {
      this.isChangeEmission = false;
    } else {

      const payload = {
        isFormValid: this.form.valid,
        isFormDirty: this.form.dirty,
        data: this.getFormData(),
      };

      this.isChangeEmission = true;

      sendEvent(this.orderHeaderEvent, OrderHeaderEventType.CHANGE_DATA, payload);
    }
  }


  private setFormData() {
    if (this.isSaved) {
      this.form.reset({
        orderNumber: this.orderData.orderNumber,
        orderTime: this.orderData.orderTime,
        status: this.orderData.status,
        priceList: this.orderData.priceList,
        supplier: this.orderData.supplier,
        salesAgent: this.orderData.salesAgent,
        paymentCondition: this.orderData.paymentCondition,
        shippingMethod: this.orderData.shippingMethod,
        customer: isEmpty(this.orderData.customer) ? null : this.orderData.customer,
        customerContact: isEmpty(this.orderData.customerContact) ? null : this.orderData.customerContact,
        customerAddress: isEmpty(this.orderData.customerAddress) ? null : this.orderData.customerAddress,
      });

      // FIX: this breaks the app
      // this.validateCustomerAddressRequired();

      this.initLists();
    } else {
      this.isChangeEmission = false;
    }
  }


  private validateEditionMode() {
    this.setFormData();

    FormHelper.setDisableForm(this.form, !this.editionMode);

    FormHelper.setDisableControl(this.form.controls.orderNumber);
    FormHelper.setDisableControl(this.form.controls.orderTime);
    FormHelper.setDisableControl(this.form.controls.status);
    FormHelper.setDisableControl(this.form.controls.priceList);
  }


  private validateCustomerAddressRequired() {
    FormHelper.clearControlValidators(this.form.controls.customerAddress);

    if (this.shippingRequired) {
      FormHelper.setControlValidators(this.form.controls.customerAddress, [Validators.required]);
    }
  }


  private resetCustomerData() {
    this.customerContactsList = this.form.value.customer.contacts ?? [];
    this.customerAddressesList = this.form.value.customer.addresses ?? [];
    this.form.controls.customerContact.reset();
    this.form.controls.customerAddress.reset();
  }


  private getFormData(): OrderGeneralData {
    const formModel = this.form.getRawValue();

    const data: OrderGeneralData = {
      orderNumber: formModel.orderNumber ?? '',
      orderTime: formModel.orderTime ?? '',
      status: formModel.status ?? null,
      statusName: formModel.status ?? null,
      priceList: formModel.priceList ?? '',
      supplier: formModel.supplier ?? null,
      salesAgent: formModel.salesAgent ?? null,
      paymentCondition: formModel.paymentCondition ?? '',
      shippingMethod: formModel.shippingMethod ?? '',
      customer: formModel.customer ?? null,
      customerContact: formModel.customerContact ?? null,
      customerAddress: formModel.customerAddress ?? null,
    };

    return data;
  }


  private loadDataList() {
    this.isLoadingDataList = true;

    combineLatest([
      this.ordersData.getOrderStatus(),
      this.contactsData.getInternalSuppliers(),
      this.contactsData.getSalesAgents(),
    ])
    .subscribe(([x, y, z]) => {
      this.statusList = x;
      this.suppliersList = y;
      this.salesAgentsList = z;
      this.isLoadingDataList = false;
    });
  }


  private initLists() {
    this.suppliersList = isEmpty(this.orderData.supplier) ? this.suppliersList :
      ArrayLibrary.insertIfNotExist(this.suppliersList ?? [], this.orderData.supplier, 'uid');
    this.salesAgentsList = isEmpty(this.orderData.salesAgent) ? this.customerContactsList :
      ArrayLibrary.insertIfNotExist(this.salesAgentsList ?? [], this.orderData.salesAgent, 'uid');
    this.customerContactsList = isEmpty(this.orderData.customerContact) ? this.customerContactsList :
      ArrayLibrary.insertIfNotExist(this.customerContactsList ?? [], this.orderData.customerContact , 'uid');
    this.customerAddressesList = isEmpty(this.orderData.customerAddress) ? this.customerAddressesList :
      ArrayLibrary.insertIfNotExist(this.customerAddressesList ?? [], this.orderData.customerAddress, 'uid');
  }

}
