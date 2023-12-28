import { Injectable, OnDestroy, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Subject, catchError, takeUntil } from "rxjs";
import { ShippingActions } from "./shipping.actions";

import { ErrorLoggingActions } from "src/app/store/errors-logging/errors-logging.actions";
import { CartState } from "src/app/store/cart/cart.state";
import { HttpClient } from "@angular/common/http";
import { WoocommerceHelperService } from "src/app/shared/wooApi";
import { Order } from "src/app/shared/blogApi/utils/types/wooCommerceTypes";
import { CartActions } from "../cart/cart.actions";
import { CustomerState } from "../customer/customer.state";
import { LoadingService } from "src/app/shared/utils/loading.service";
import { WoocommerceShippingService } from "src/app/shared/wooApi/shipping/shipping.service";

export interface IShippingStateModel {
    shipping_methods: any;
    shipping_classes: any;
    payment_gateways: any;
    shipping_zones: any;
    tax_classes: any;
    payment_gateway: string;
    selected_shipping_zone: any;
    selected_shipping_line: any;
}

@State<IShippingStateModel>({
    name: 'shipping',
})
@Injectable({
    providedIn: 'root'
})
export class ShippingState implements OnDestroy {

    private readonly ngUnsubscribe = new Subject();

    private wooApiSerice = inject(WoocommerceShippingService);

    private loadingService = inject(LoadingService);

    private store = inject(Store);

    constructor(
        private httpClient: HttpClient,
        private wooHelper: WoocommerceHelperService
    ) { }

    @Selector()
    static getShippingMethods(state: IShippingStateModel) {
        return state.shipping_methods;
    }
    @Selector()
    static getShippingClasses(state: IShippingStateModel) {
        return state.shipping_classes;
    }
    @Selector()
    static getPaymentGateways(state: IShippingStateModel) {
        return state.payment_gateways;
    }
    @Selector()
    static getShippingZones(state: IShippingStateModel) {
        return state.shipping_zones;
    }
    @Selector()
    static getTaxClasses(state: IShippingStateModel) {
        return state.tax_classes;
    }

    @Selector()
    static getSelectedPaymentGateway(state: IShippingStateModel): any {
        return state.payment_gateway;
    }

    @Selector()
    static getSelectedShippingZone(state: IShippingStateModel): any {
        return state.selected_shipping_zone;
    }

    @Selector()
    static getSelectedShippingLines(state: IShippingStateModel): any {
        return state.selected_shipping_line;
    }

    @Action(ShippingActions.RetrieveShippingClasses)
    async retrieveShippingClasses(ctx: StateContext<IShippingStateModel>) {
        // console.log('shipping_classes');
        const state = ctx.getState();
        this.wooApiSerice.retrieveShippingClasses()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((shipping_classes: any) => {
                // console.log(shipping_classes);
                return ctx.patchState({
                    ...state,
                    shipping_classes,
                });
            });
    }

    @Action(ShippingActions.RetrievePaymentGateways)
    async retrievePaymentGateways(ctx: StateContext<IShippingStateModel>) {
        // console.log('payment_gateways');
        const state = ctx.getState();
        this.wooApiSerice.retrievePaymentGateways()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((payment_gateways: any) => {
                // console.log(payment_gateways);
                return ctx.patchState({
                    ...state,
                    payment_gateways,
                });
            });
    }

    @Action(ShippingActions.RetrieveShippingZones)
    async retrieveShippingZones(ctx: StateContext<IShippingStateModel>) {
        // console.log('shipping/zones');
        const state = ctx.getState();
        this.wooApiSerice.retrieveShippingZones()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((shipping_zones: any) => {
                // console.log(shipping_zones);
                return ctx.patchState({
                    ...state,
                    shipping_zones,
                });
            });
    }

    @Action(ShippingActions.RetrieveTaxesClasses)
    async RetrieveTaxesClasses(ctx: StateContext<IShippingStateModel>) {
        // console.log('taxes/classes');
        const state = ctx.getState();
        this.wooApiSerice.retrieveTaxesClasses()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((tax_classes: any) => {
                console.log(tax_classes);
                return ctx.patchState({
                    ...state,
                    tax_classes,
                });
            });
    }


    @Action(ShippingActions.SetShippingMethods)
    async setShippingMethods(ctx: StateContext<IShippingStateModel>, { selectedZone }: ShippingActions.SetShippingMethods) {
        // await this.loadingService.simpleLoader();
        console.log('selectedZone', selectedZone,);
        const state = ctx.getState();
        try {
            if (selectedZone.id) {
                this.wooApiSerice.getAllShippingMethods(selectedZone.id)
                    .subscribe(async (shippingDetails: any) => {
                        console.log(shippingDetails);
                        return ctx.patchState({
                            ...state,
                            shipping_methods: shippingDetails,
                            selected_shipping_zone: selectedZone
                        });
                    });
            }
            // await this.loadingService.simpleLoader();
        } catch (error: any) {
            this.wooHelper.handleError(error);
            // this.loadingService.dismissLoader();
        }
    }

    @Action(ShippingActions.UpdateCartShippingLines)
    async updateOrder(ctx: StateContext<IShippingStateModel>, { selectedShippingLine }: ShippingActions.UpdateCartShippingLines) {
        // console.log(selectedShippingLine);
        const state = ctx.getState();
        if (selectedShippingLine) {
            return ctx.patchState({
                ...state,
                selected_shipping_line: selectedShippingLine,
            });
        }
    }

    @Action(ShippingActions.UpdateCartPaymentGateways)
    async UpdateCartPaymentGateways(ctx: StateContext<IShippingStateModel>, { paymentGateway }: ShippingActions.UpdateCartPaymentGateways) {
        const cart = this.store.selectSnapshot(CartState.getCart);
        const customer = this.store.selectSnapshot(CustomerState.getCustomer);
        try {
            if (cart?.id) {
                const order: Order = {
                    id: cart.id,
                    customer_id: cart.customer_id,
                    payment_method: paymentGateway.id,
                    payment_method_title: "Card",
                }
                this.store.dispatch(new CartActions.UpdateCartOrder(order));
            } else {
                const order: Order = {
                    customer_id: customer.id,
                    payment_method: paymentGateway.id,
                    payment_method_title: "Card",
                    // line_items: [
                    //     {
                    //         // name: lineItem.name,
                    //         // product_id: lineItem.product_id,
                    //         // quantity: lineItem.quantity,
                    //         // price: item.price,
                    //     },
                    // ],
                };
                this.store.dispatch(new CartActions.CreateCart(order));
            }
            if (paymentGateway) {
                ctx.patchState({
                    payment_gateway: paymentGateway,
                });
            }
        } catch (error: any) {
            this.wooHelper.handleError(error)
        }
    }


    @Action(ShippingActions.GetShippingDetails)
    async getShippingDetails(ctx: StateContext<IShippingStateModel>, { zoneID, methodId }: ShippingActions.GetShippingDetails) {
        // await this.loadingService.simpleLoader();
        // console.log('zoneID', zoneID,);
        // console.log('methodId', methodId);
        const state = ctx.getState();
        try {
            // this.wooApiSerice.listAllShippingMethods(methodId)
            //     .subscribe(async (shippingDetails: any) => {
            //         console.log(shippingDetails);
            //     });
            // await this.loadingService.simpleLoader();
        } catch (error: any) {
            this.wooHelper.handleError(error);
            // this.loadingService.dismissLoader();
        }
    }

    @Action(ShippingActions.ClearShippingDetails)
    async clearShippingDetails(ctx: StateContext<IShippingStateModel>) {
        const state = ctx.getState();
        try {
            return ctx.patchState({
                ...state,
                selected_shipping_line: null,
                selected_shipping_zone: null,
            });
        } catch (error: any) {
            this.wooHelper.handleError(error);
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}
