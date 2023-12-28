import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ShippingActions } from 'src/app/store/shipping/shipping.actions';
import { IShippingFacadeModel, ShippingFacade } from './shipping.facade';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { CartState } from 'src/app/store/cart/cart.state';
import { CustomerState } from 'src/app/store/customer/customer.state';
import { ShippingState } from 'src/app/store/shipping/shipping.state';
import { Order } from 'src/app/shared/blogApi/utils/types/wooCommerceTypes';

@Component({
  selector: 'shipping-component',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    ReactiveFormsModule
  ]
})
export class ShippingComponent implements OnInit, OnDestroy {
  viewState$!: Observable<IShippingFacadeModel>;

  // selected_shipping_line: any;

  methodId: string = '';

  zoneID: string = '';

  selectedShippingLine: any;

  private facade = inject(ShippingFacade);

  private store = inject(Store);

  private sanitizer = inject(DomSanitizer);

  private readonly ngUnsubscribe = new Subject();

  constructor() { }


  ionViewWillEnter() {

  }

  ngOnInit() {
    this.store.dispatch(new ShippingActions.ClearShippingDetails());
    this.store.dispatch(new ShippingActions.RetrieveShippingMethods());
    this.store.dispatch(new ShippingActions.RetrievePaymentGateways());
    this.store.dispatch(new ShippingActions.RetrieveShippingZones());
    this.viewState$ = this.facade.viewState$;

    // this.viewState$.pipe(
    //   takeUntil(this.ngUnsubscribe),
    //   take(1),
    // ).subscribe({
    //   next: (vs: any) => {
    //     console.log(vs.selected_shipping_zone);
    //     console.log(vs.selected_shipping_line);

    //     // if (vs.selected_shipping_line.settings != null) {
    //     //   this.selectedShippingLine = vs.selected_shipping_line;
    //     // }
    //   },
    // });
  }

  shippingZones($event: any) {
    const selectedZone = $event.target.value;
    // console.log(selectedZone);
    this.store.dispatch(new ShippingActions.SetShippingMethods(selectedZone));
  }

  shippingLinesChange($event: any) {
    this.methodId = $event.target.value.id;
    this.store.dispatch(new ShippingActions.UpdateCartShippingLines($event.target.value));
  }

  selectShippingSetting(setting: any) {
    // console.log(setting.value);
    const cart = this.store.selectSnapshot(CartState.getCart);
    const customer = this.store.selectSnapshot(CustomerState.getCustomer);
    // const selected_shipping_zone = this.store.selectSnapshot(ShippingState.getSelectedShippingZone);
    const selected_shipping_line = this.store.selectSnapshot(ShippingState.getSelectedShippingLines);

    if (cart?.id) {
      const order: Order = {
        id: cart.id,
        customer_id: cart.customer_id,
        "shipping_lines": [
          {
            "method_title": selected_shipping_line.method_title,
            "method_id": selected_shipping_line.method_id,
            "total": setting.value,
          }
        ],
      };
      this.store.dispatch(new CartActions.UpdateCartOrder(order));
    } 
    else if (customer.id) {
      const order: Order = {
        customer_id: customer.id,
        "shipping_lines": [
          {
            "method_title": selected_shipping_line.method_title,
            "method_id": selected_shipping_line.method_id,
            "total": setting.value,
            // "total_tax": "0.00",
          }
        ],
      };
      this.store.dispatch(new CartActions.CreateCart(order));
    }
  }

  taxSelectChange($event: any) {
    console.log($event.detail.value);
  }

  paymentGatewaysChange($event: any) {
    // console.log($event.detail.value);
    // const methodId = $event.detail.value.id;
    const method = $event.detail.value;
    this.store.dispatch(new ShippingActions.UpdateCartPaymentGateways(method));
  }

  sanitise(content: any) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
