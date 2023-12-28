import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { CartState } from "src/app/store/cart/cart.state";
import { Order } from "src/app/shared/blogApi/utils/types/wooCommerceTypes";
import { PaymentState } from "src/app/store/payment/payment.state";

export class IPaymentComponentFacadeModel {
    cart: Order;
    secret_key: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentComponentFacade {

    @Select(CartState.getCart) cart$!: Observable<Order>;

    @Select(PaymentState.getPaymentSecretKey) secret_key$!: Observable<string>;

    readonly viewState$: Observable<IPaymentComponentFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.cart$,
                this.secret_key$,
            ]
        )
            .pipe(
                map((
                    [
                        cart,
                        secret_key,
                    ]
                ) => (
                    {
                        cart,
                        secret_key,
                    }
                ))
            );
    }
}
