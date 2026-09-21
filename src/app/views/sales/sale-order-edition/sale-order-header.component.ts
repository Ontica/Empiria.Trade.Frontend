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

import { ContactsDataService, SalesDataService, ShippingDataService } from '@app/data-services';

import { DefaultOrdersStatus, EmptySaleOrderGeneralData, SaleOrderGeneralData, Party, PaymentConditionsList,
         ShippingMethodList, ShippingMethodTypes, CustomerSelection, EmptyCustomerSelection,
         buildCustomerSelection } from '@app/models';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';


export enum SaleOrderHeaderEventType {
  CHANGE_DATA = 'SaleOrderHeaderComponent.Event.ChangeData',
}

interface SaleOrderFormModel extends FormGroup<{
  orderNumber: FormControl<string>;
  orderTime: FormControl<DateString>;
  status: FormControl<string>;
  supplier: FormControl<Party>;
  salesAgent: FormControl<Party>;
  paymentConditions: FormControl<string>;
  shippingMethod: FormControl<string>;
  parcelSupplier: FormControl<string>;
  customer: FormControl<CustomerSelection>;
}> { }

@Component({
  selector: 'emp-trade-sale-order-header',
  templateUrl: './sale-order-header.component.html',
})
export class SaleOrderHeaderComponent implements OnChanges, OnInit {

  @Input() orderData: SaleOrderGeneralData = EmptySaleOrderGeneralData;

  @Input() editionMode = false;

  @Input() isSaved = false;

  @Output() saleOrderHeaderEvent = new EventEmitter<EventInfo>();

  form: SaleOrderFormModel;

  formHelper = FormHelper;

  isLoading = false;

  isChangeEmission = false;

  statusList: Identifiable[] = [];

  paymentConditionsList: Identifiable[] = PaymentConditionsList;

  shippingMethodList: Identifiable[] = ShippingMethodList;

  parcelSuppliersList: Identifiable[] = [];

  salesAgentsList: Party[] = [];

  suppliersList: Party[] = [];


  constructor(private contactsData: ContactsDataService,
              private salesData: SalesDataService,
              private shippingData: ShippingDataService) {
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


  get parcelSupplierPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    if (!this.form.getRawValue().shippingMethod) {
      return 'Seleccione forma de envío';
    }

    if (!this.isPaqueteria) {
      return 'No aplica';
    }

    return 'Seleccionar';
  }


  get isPaqueteria(): boolean {
    return this.form.getRawValue().shippingMethod === ShippingMethodTypes.Paqueteria;
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


  onShippingMethodChanges(event: string) {
    this.validateDisabledControls();
    this.form.controls.parcelSupplier.reset();
  }


  invalidateForm() {
    FormHelper.markFormControlsAsTouched(this.form);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      orderNumber: [''],
      orderTime: [DateStringLibrary.today(), Validators.required],
      status: [DefaultOrdersStatus, Validators.required],
      supplier: [null as Party, Validators.required],
      salesAgent: [null as Party, Validators.required],
      paymentConditions: ['', Validators.required],
      shippingMethod: ['', Validators.required],
      parcelSupplier: [''],
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

      sendEvent(this.saleOrderHeaderEvent, SaleOrderHeaderEventType.CHANGE_DATA, payload);
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
        supplier: this.orderData.supplier,
        salesAgent: this.orderData.salesAgent,
        paymentConditions: this.orderData.paymentConditions,
        shippingMethod: this.orderData.shippingMethod,
        parcelSupplier: this.orderData.parcelSupplier?.uid,
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

    this.validateDisabledControls();
  }


  private validateDisabledControls() {
    const formDisabled = (this.isSaved && !this.editionMode) || !this.isPaqueteria;
    FormHelper.setDisableControl(this.form.controls.parcelSupplier, formDisabled);
  }


  private getFormData(): SaleOrderGeneralData {
    const formModel = this.form.getRawValue();

    const data: SaleOrderGeneralData = {
      orderNumber: formModel.orderNumber ?? '',
      orderTime: formModel.orderTime ?? '',
      status: formModel.status ?? null,
      statusName: formModel.status ?? null,
      supplier: formModel.supplier ?? null,
      salesAgent: formModel.salesAgent ?? null,
      paymentConditions: formModel.paymentConditions ?? '',
      shippingMethod: formModel.shippingMethod ?? '',
      parcelSupplier: this.parcelSupplierSelected,
      customer: formModel.customer?.customer ?? null,
      customerContact: formModel.customer?.contact ?? null,
      customerAddress: formModel.customer?.address ?? null,
    };

    return data;
  }


  get parcelSupplierSelected(): Identifiable<string> {
    const parcel = this.parcelSuppliersList.find(x => x.uid === this.form.getRawValue().parcelSupplier) ?? null;

    return (isEmpty(parcel as Identifiable) ? null : parcel) as Identifiable<string>;
  }


  private loadDataList() {
    this.isLoading = true;

    combineLatest([
      this.salesData.getOrderStatus(),
      this.contactsData.getInternalSuppliers(),
      this.contactsData.getSalesAgents(),
      this.shippingData.getParcelSuppliers(),
    ])
    .subscribe(([a, b, c, d]) => {
      this.statusList = a;
      this.suppliersList = b;
      this.salesAgentsList = c;
      this.parcelSuppliersList = d;
      this.isLoading = false;
    });
  }


  private initLists() {
    this.suppliersList = isEmpty(this.orderData.supplier) ? this.suppliersList :
      ArrayLibrary.insertIfNotExist(this.suppliersList ?? [], this.orderData.supplier, 'uid');
    this.salesAgentsList = isEmpty(this.orderData.salesAgent) ? this.salesAgentsList :
      ArrayLibrary.insertIfNotExist(this.salesAgentsList ?? [], this.orderData.salesAgent, 'uid');
  }

}
