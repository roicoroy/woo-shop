import { Injectable, inject } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { CartState } from "src/app/store/cart/cart.state";
import { Order, Product } from "src/app/shared/blogApi/utils/types/wooCommerceTypes";
import { CartActions } from "src/app/store/cart/cart.actions";
import { AlertService } from "src/app/shared/utils/alert.service";

export class ICartComponentFacadeModel {
    cart: Order;
    lineItems: any;
}

@Injectable({
    providedIn: 'root'
})
export class CartComponentFacade {

    @Select(CartState.getCart) cart$!: Observable<Order>;

    // @Select(CartState.cartTotal) cartTotal$!: Observable<any>;

    @Select(CartState.getLineItems) lineItems$!: Observable<any>;

    private store = inject(Store);

    private alertService = inject(AlertService);

    readonly viewState$: Observable<ICartComponentFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.cart$,
                this.lineItems$,
            ]
        )
            .pipe(
                map((
                    [
                        cart,
                        lineItems,
                    ]
                ) => (
                    {
                        cart,
                        lineItems,
                    }
                ))
            );
    }

    getCartById() {
        const cart = this.store.selectSnapshot(CartState.getCart);
        if (cart?.id) {
            this.store.dispatch(new CartActions.GetCartByIdCart(cart.id));
        }
    }

    updateCart(product: Product, counterValue: number) {
        const lineItmesArray = this.store.selectSnapshot(CartState.getLineItems);
        // console.log(product);
        if (lineItmesArray) {
            lineItmesArray.forEach(async (item: any) => {
                console.log(item.product_id);
                if (item.product_id === product.id) {
                    await this.alertService.presentSimpleAlert('Item Already Added!');
                }
            });
        } else {
            this.store.dispatch(new CartActions.UpdateLineItem(product, counterValue));
        }
    }

}
