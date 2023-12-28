import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsState } from '../store/products/products.state';
import { CartState } from '../store/cart/cart.state';
import { Order } from '@stripe/stripe-js';
import { Product } from '../shared/blogApi/utils/types/wooCommerceTypes';

export interface IProductsFacadeModel {
    products: Product[];
    product: Product;
    cart: Order;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsFacade {

    @Select(ProductsState.getProducts) products$!: Observable<Product[]>;

    @Select(ProductsState.getSelectedProduct) product$!: Observable<Product>;

    @Select(CartState.getCart) cart$!: Observable<Order>;

    readonly viewState$: Observable<IProductsFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.products$,
                this.product$,
                this.cart$,
            ]
        )
            .pipe(
                map((
                    [
                        products,
                        product,
                        cart
                    ]
                ) => ({
                    products,
                    product,
                    cart
                }))
            );
    }
}
