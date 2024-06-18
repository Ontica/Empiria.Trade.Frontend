/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { DateString, DateStringLibrary, EventInfo, Identifiable, Validate, isEmpty } from '@app/core';

import { ContactsDataService, SalesOrdersDataService } from '@app/data-services';

import { DefaultOrderStatus, EmptyOrderGeneralData, OrderGeneralData, Party, PaymentConditionList,
         ShippingMethodList, ShippingMethodTypes, CustomerSelection, EmptyCustomerSelection,
         buildCustomerSelection } from '@app/models';

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
  customer: FormControl<CustomerSelection>;
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


  get isFormValid(): boolean {
    return this.form.valid;
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
      customer: [EmptyCustomerSelection, Validate.objectFieldsRequired('customer', 'address')],
    });

    this.form.valueChanges.subscribe(v => this.emitFormChanges());
  }


  private emitFormChanges() {
    if (this.isChangeEmission) {
      this.isChangeEmission = false;
    } else {

      const payload = {
        isFormValid: this.isFormValid,
        isFormDirty: this.form.dirty,
        data: this.getFormData(),
      };

      this.isChangeEmission = true;

      sendEvent(this.orderHeaderEvent, OrderHeaderEventType.CHANGE_DATA, payload);
    }
  }


  private setFormData() {
    if (this.isSaved) {
      const customerData = buildCustomerSelection(
        this.orderData.customer, this.orderData.customerContact, this.orderData.customerAddress
      );

      this.form.reset({
        orderNumber: this.orderData.orderNumber,
        orderTime: this.orderData.orderTime,
        status: this.orderData.status,
        priceList: this.orderData.priceList,
        supplier: this.orderData.supplier,
        salesAgent: this.orderData.salesAgent,
        paymentCondition: this.orderData.paymentCondition,
        shippingMethod: this.orderData.shippingMethod,
        customer: customerData,
      });

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
      customer: formModel.customer?.customer ?? null,
      customerContact: formModel.customer?.contact ?? null,
      customerAddress: formModel.customer?.address ?? null,
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
    this.salesAgentsList = isEmpty(this.orderData.salesAgent) ? this.salesAgentsList :
      ArrayLibrary.insertIfNotExist(this.salesAgentsList ?? [], this.orderData.salesAgent, 'uid');
  }

}
