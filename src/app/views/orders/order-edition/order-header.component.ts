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

import { Contact, Customer, DefaultOrderStatus, EmptyOrder, Order, OrderData, Party, PaymentConditionList,
         ShippingMethodList } from '@app/models';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';


export enum OrderHeaderEventType {
  CHANGE_DATA = 'OrderHeaderComponent.Event.ChangeData',
}

interface OrderFormModel extends FormGroup<{
  orderNumber: FormControl<string>;
  orderTime: FormControl<DateString>;
  status: FormControl<string>;
  customer: FormControl<Customer>;
  customerContact: FormControl<Contact>;
  salesAgent: FormControl<Party>;
  supplier: FormControl<Party>;
  paymentCondition: FormControl<string>;
  shippingMethod: FormControl<string>;
}> { }

@Component({
  selector: 'emp-trade-order-header',
  templateUrl: './order-header.component.html',
})
export class OrderHeaderComponent implements OnChanges, OnInit {

  @Input() order: Order = EmptyOrder();

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
    if (changes.order) {
      this.setFormData();
    }

    if (changes.editionMode) {
      this.validateEditionMode();
    }
  }


  get contactsPlaceholder(): string {
    if (this.form.controls.customer.invalid) {
      return 'Seleccione al cliente';
    }

    return this.form.value.customer.contacts?.length === 0 ?
      'El cliente no tiene contactos' :
      'Seleccione el contacto';
  }


  onCustomertChange() {
    this.customerContactsList = this.form.value.customer.contacts ?? [];
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
      customer: [null as Customer, Validators.required],
      customerContact: [null],
      salesAgent: [null as Party, Validators.required],
      supplier: [null as Party, Validators.required],
      paymentCondition: ['', Validators.required],
      shippingMethod: ['', Validators.required],
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
        orderData: this.getFormData(),
      };

      this.isChangeEmission = true;

      sendEvent(this.orderHeaderEvent, OrderHeaderEventType.CHANGE_DATA, payload);
    }
  }


  private setFormData() {
    if (this.isSaved) {
      this.form.reset({
        orderNumber: this.order.orderNumber,
        orderTime: this.order.orderTime,
        status: this.order.status,
        customer: this.order.customer,
        customerContact: this.order.customerContact ?? null,
        salesAgent: this.order.salesAgent,
        supplier: this.order.supplier,
        paymentCondition: this.order.paymentCondition,
        shippingMethod: this.order.shippingMethod,
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
  }


  private getFormData(): OrderData {
    const formModel = this.form.getRawValue();

    const data: OrderData = {
      orderNumber: formModel.orderNumber ?? '',
      orderTime: formModel.orderTime ?? '',
      status: formModel.status ?? null,
      statusName: formModel.status ?? null,
      customer: formModel.customer ?? null,
      customerContact: formModel.customerContact ?? null,
      salesAgent: formModel.salesAgent ?? null,
      supplier: formModel.supplier ?? null,
      paymentCondition: formModel.paymentCondition ?? '',
      shippingMethod: formModel.shippingMethod ?? '',
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
    this.customerContactsList = isEmpty(this.order.customerContact) ? this.customerContactsList :
      ArrayLibrary.insertIfNotExist(this.customerContactsList ?? [], this.order.customerContact , 'uid');
    this.salesAgentsList = isEmpty(this.order.salesAgent) ? this.customerContactsList :
      ArrayLibrary.insertIfNotExist(this.salesAgentsList ?? [], this.order.salesAgent, 'uid');
    this.suppliersList = isEmpty(this.order.supplier) ? this.suppliersList :
      ArrayLibrary.insertIfNotExist(this.suppliersList ?? [], this.order.supplier, 'uid');
    this.subscribeCustomersList();
  }


  private subscribeCustomersList() {
    this.customersList$ = concat(
      of(isEmpty(this.order.customer) ? [] : [this.order.customer]),
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
