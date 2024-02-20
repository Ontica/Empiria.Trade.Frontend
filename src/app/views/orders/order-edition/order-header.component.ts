/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject, catchError, combineLatest, concat, debounceTime, delay, distinctUntilChanged,
         filter, of, switchMap, tap } from 'rxjs';

import { DateString, DateStringLibrary, EventInfo, Identifiable, isEmpty } from '@app/core';

import { ContactsDataService, SalesOrdersDataService } from '@app/data-services';

import { Address, Contact, Customer, DefaultOrderStatus, EmptyOrderGeneralData, OrderGeneralData, Party,
         PaymentConditionList, ShippingMethodList } from '@app/models';

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
  customerAddress: FormControl<Identifiable>;
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

  customersList$: Observable<Customer[]>;

  customersInput$ = new Subject<string>();

  isCustomersLoading = false;

  minTermLength = 5;


  constructor(private contactsData: ContactsDataService,
              private ordersData: SalesOrdersDataService) {
    this.initForm();
    this.validateEditionMode();
  }


  ngOnInit() {
    this.loadDataList();
    this.subscribeCustomersList();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderData) {
      this.setFormData();
    }

    if (changes.editionMode) {
      this.validateEditionMode();
    }
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


  onCustomertChange() {
    this.customerContactsList = this.form.value.customer.contacts ?? [];
    this.customerAddressesList = this.form.value.customer.addresses ?? [];
    this.form.controls.customerContact.reset();
  }


  invalidateForm() {
    this.formHelper.markFormControlsAsTouched(this.form);
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
      customerAddress: [null],
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
        customer: this.orderData.customer,
        customerContact: this.orderData.customerContact ?? null,
        customerAddress: this.orderData.customerAddress ?? null,
      });

      this.initLists();
    } else {
      this.isChangeEmission = false;
    }
  }


  private validateEditionMode() {
    this.setFormData();

    this.formHelper.setDisableForm(this.form, !this.editionMode);

    this.formHelper.setDisableControl(this.form.controls.orderNumber);
    this.formHelper.setDisableControl(this.form.controls.orderTime);
    this.formHelper.setDisableControl(this.form.controls.status);
    this.formHelper.setDisableControl(this.form.controls.priceList);
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
    this.subscribeCustomersList();
  }


  private subscribeCustomersList() {
    this.customersList$ = concat(
      of(isEmpty(this.orderData.customer) ? [] : [this.orderData.customer]),
      this.customersInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.minTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.isCustomersLoading = true),
        switchMap(keyword =>
          this.contactsData.getCustomersWithContacts(keyword)
            .pipe(
              delay(2000),
              catchError(() => of([])),
              tap(() => this.isCustomersLoading = false)
            ))
      )
    );
  }

}
