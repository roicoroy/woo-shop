import { Injectable, OnDestroy, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Subject } from "rxjs";
import { StripeIntend, WoocommerceHelperService } from "src/app/shared/wooApi";
import { PaymentActions } from "./payment.actions";
import { CartActions } from "../cart/cart.actions";
import { environment } from "src/environments/environment";
import { Order } from "src/app/shared/blogApi/utils/types/wooCommerceTypes";
const stripe = require("stripe")(environment.STRIPE_SECRET_KEY);

export interface IPaymentStateModel {
    secret_key: string;
}

@State<IPaymentStateModel>({
    name: 'payment',
})
@Injectable({
    providedIn: 'root'
})
export class PaymentState implements OnDestroy {

    private readonly ngUnsubscribe = new Subject();

    private store = inject(Store);
    
    private wooHelper = inject(WoocommerceHelperService);

    @Selector()
    static getPaymentSecretKey(state: IPaymentStateModel): string {
        return state.secret_key;
    }

    @Action(PaymentActions.CreatePaymentIntent)
    async createPaymentIntent(ctx: StateContext<IPaymentStateModel>, { order }: PaymentActions.CreatePaymentIntent) {
        try {
            const intentData: StripeIntend = {
                amount: order.total.replace('.', ""),
                currency: order.currency,
            }
            const paymentIntent = await stripe.paymentIntents.create(intentData);

            if (paymentIntent) {
                ctx.patchState({
                    secret_key: paymentIntent.client_secret,
                });
            }
            const data: Order = {
                id: order.id,
                customer_id: order.customer_id,
                payment_method: "stripe",
                payment_method_title: "Card",
                set_paid: false,
                meta_data: [
                    {
                        key: "_stripe_intent_id",
                        value: paymentIntent.id,
                    },
                ],
            };
            this.store.dispatch(new CartActions.UpdateCartOrder(data));


        } catch (error: any) {
            this.wooHelper.handleError(error);
        }
    }

    @Action(PaymentActions.ClearPaymentState)
    async clearPaymentState(ctx: StateContext<IPaymentStateModel>) {
        
        console.log("£££");
        
        return ctx.patchState({
            secret_key: null,
        });
    }

    ngOnDestroy(): void {
        this.store.dispatch(new PaymentActions.ClearPaymentState());
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}