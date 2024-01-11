/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { ArrayLibrary, clone } from '@app/shared/utils';

import { EmptyOrder, EmptyOrderQuery, Order, OrderDescriptor, OrderQuery, OrderQueryType, OrderTypeConfig,
         mapOrderDescriptorFromOrder } from '@app/models';

import { SalesOrdersDataService } from '@app/data-services';

import { OrderCreatorEventType } from '@app/views/orders/order-creator/order-creator.component';

import { OrderTabbedViewEventType } from '@app/views/orders/order-tabbed-view/order-tabbed-view.component';

import { OrdersListingEventType } from '@app/views/orders/orders-listing/orders-listing.component';


@Component({
  selector: 'emp-trade-sales-main-page',
  templateUrl: './sales-main-page.component.html',
})
export class SalesMainPageComponent implements OnInit, OnDestroy {

  salesConfig: OrderTypeConfig = {
    type: OrderQueryType.Sales,
    titleText: 'Pedido',
    itemText: 'pedido',
    canAdd: false,
  };

  isLoading = false;

  queryExecuted = false;

  query: OrderQuery = EmptyOrderQuery;

  ordersList: OrderDescriptor[] = [];

  isLoadingOrder = false;

  orderSelected: Order = EmptyOrder();

  displaySecondaryView = false;

  displayOrderCreator = false;

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private salesOrdersData: SalesOrdersDataService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.getCurrentView();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  onOrderCreatorEvent(event: EventInfo) {
    switch (event.type as OrderCreatorEventType) {
      case OrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayOrderCreator = false;
        return;

      case OrderCreatorEventType.ORDER_CREATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.insertOrderToList(event.payload.order as Order);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersListingEvent(event: EventInfo) {
    switch (event.type as OrdersListingEventType) {
      case OrdersListingEventType.CREATE_ORDER:
        this.clearOrderSelected();
        this.displayOrderCreator = true;
        return;

      case OrdersListingEventType.SEARCH_ORDERS:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as OrderQuery;
        this.clearOrderSelected();
        this.searchOrders(this.query);
        return;

      case OrdersListingEventType.SELECT_ORDER:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getOrder(event.payload.entry.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;

    }
  }


  onOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as OrderTabbedViewEventType) {
      case OrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.clearOrderSelected();
        return;

      case OrderTabbedViewEventType.ORDER_UPDATED:
      case OrderTabbedViewEventType.ORDER_CANCELED:
        this.setOrderSelected(event.payload.order ?? EmptyOrder() as Order);
        this.resetSearchData();
        // TODO: check if it can be implemented with this code instead of 'setOrderSelected' and 'resetSearchData'
        // this.insertOrderToList(event.payload.order ?? EmptyOrder() as Order);
        return;

      case OrderTabbedViewEventType.ORDER_PACKING_UPDATED:
      case OrderTabbedViewEventType.ORDER_SHIPPING_UPDATED:
        this.resetOrderSelected();
        this.resetSearchData();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getCurrentView() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.validateCurrentView(x.name));
  }


  private validateCurrentView(view: string) {
    switch (view) {
      case 'VentasViews.Pedidos':
        this.setInitConfig(OrderQueryType.Sales, 'Pedidos', 'pedido', true);
        return;

      case 'VentasViews.Autorizaciones':
        this.setInitConfig(OrderQueryType.SalesAuthorization, 'Autorizaciones', '', false);
        return;

      case 'AlmacenesViews.Surtidos':
        this.setInitConfig(OrderQueryType.SalesPacking, 'Surtidos', '', false);
        return;

      default:
        break;
    }
  }


  private setInitConfig(type: OrderQueryType, titleText: string, itemText: string, canAdd: boolean) {
    this.salesConfig = {
      type,
      titleText,
      itemText,
      canAdd,
    };

    this.query = Object.assign({}, EmptyOrderQuery, { queryType: type });
  }


  private searchOrders(query: OrderQuery) {
    this.clearData();

    this.salesOrdersData.searchOrders(query)
      .firstValue()
      .then(x => this.setOrderData(x))
      .finally(() => this.isLoading = false)
  }


  private getOrder(orderUID: string) {
    this.isLoadingOrder = true;

    this.salesOrdersData.getOrder(orderUID, this.salesConfig.type)
      .firstValue()
      .then(x => this.setOrderSelected(x))
      .finally(() => this.isLoadingOrder = false);
  }


  private setOrderData(data: OrderDescriptor[]) {
    this.ordersList = data;
    this.queryExecuted = true;

    if (!this.ordersList.some(x => x.uid === this.orderSelected.uid)) {
      this.clearOrderSelected();
    }
  }


  private clearData() {
    this.ordersList = [];
    this.isLoading = true;
    this.queryExecuted = false;
  }


  private setOrderSelected(order: Order) {
    this.orderSelected = clone(order);
    this.displaySecondaryView = !!this.orderSelected.uid;
  }


  private clearOrderSelected() {
    this.setOrderSelected(EmptyOrder());
  }


  private resetSearchData() {
    this.searchOrders(this.query);
  }


  private resetOrderSelected() {
    this.getOrder(this.orderSelected.uid);
  }


  private insertOrderToList(order: Order) {
    this.displayOrderCreator = false;
    const orderToInsert = mapOrderDescriptorFromOrder(order);
    const newOrdersList = ArrayLibrary.insertItemTop(this.ordersList, orderToInsert, 'uid');
    this.setOrderData(newOrdersList);
    this.setOrderSelected(order);
  }

}
