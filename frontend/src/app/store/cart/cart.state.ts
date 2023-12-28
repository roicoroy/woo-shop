
import { Injectable, OnDestroy, inject } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Subject, catchError, takeUntil } from 'rxjs';
import { CartActions } from './cart.actions';
import { LineItem, Order } from 'src/app/shared/blogApi/utils/types/wooCommerceTypes';
import { WoocommerceHelperService, WoocommerceOrderService } from 'src/app/shared/wooApi';
import { LoadingService } from 'src/app/shared/utils/loading.service';
import { ErrorLoggingActions } from '../errors-logging/errors-logging.actions';
import { ProductsState } from '../products/products.state';

export interface ICartStateModel {
    cart: Order;
    lineItems: LineItem[];
}

@State<ICartStateModel>({
    name: 'cart',
    defaults: {
        cart: null,
        lineItems: [],
    }
})
@Injectable({
    providedIn: 'root'
})
export class CartState implements OnDestroy {

    private store = inject(Store);

    private wooApiOrders = inject(WoocommerceOrderService);

    private wooHelper = inject(WoocommerceHelperService)

    private loadingService = inject(LoadingService);

    private readonly ngUnsubscribe = new Subject();

    @Selector()
    static getCart(state: ICartStateModel): Order {
        return state.cart;
    }

    @Selector()
    static getLineItems(state: ICartStateModel) {
        return state.lineItems;
    }

    @Action(CartActions.CreateCart)
    createCart(ctx: StateContext<ICartStateModel>, { order }: CartActions.CreateCart) {
        const state = ctx.getState();
        if (order) {
            this.wooApiOrders.createOrder(order)
                .subscribe((order: Order) => {
                    console.log('Cart Created', order);
                    return ctx.patchState({
                        ...state,
                        cart: order
                    });
                });
        }
    }

    @Action(CartActions.UpdateLineItems)
    async updateLineItems(ctx: StateContext<ICartStateModel>, { lineItems, cutomerId }: CartActions.UpdateLineItems) {
        await this.loadingService.simpleLoader();
        const state = ctx.getState();
        const cart = this.store.selectSnapshot(CartState.getCart);
        try {
            if (cart) {
                const newOrder: Order = {
                    id: cart.id,
                    customer_id: cart.customer_id,
                    line_items: cart.line_items.length > 0 ? sortLineItems(cart.line_items, lineItems[0]) : lineItems,
                }
                if (newOrder) {
                    this.wooApiOrders.updateOrder(newOrder)
                        .subscribe((order: Order) => {
                            console.log('updated Order', order);
                            this.loadingService.dismissLoader();
                            return ctx.patchState({
                                ...state,
                                cart: order
                            });
                        });
                }
            }
        } catch (error: any) {
            this.wooHelper.handleError(error);
            this.loadingService.dismissLoader();
        }
    }

    @Action(CartActions.UpdateCartOrder)
    UpdateCartOrder(ctx: StateContext<ICartStateModel>, { order }: CartActions.UpdateCartOrder) {
        const state = ctx.getState();
        const cart = this.store.selectSnapshot(CartState.getCart);
        if (cart) {
            console.log(order);
            this.wooApiOrders.updateOrder(order)
                .subscribe((order: Order) => {
                    console.log('UpdateCartOrder', order);
                    return ctx.patchState({
                        ...state,
                        cart: order
                    });
                });
        }
    }

    @Action(CartActions.GetCartByIdCart)
    async getCartByIdCart(ctx: StateContext<ICartStateModel>, { cartId }: CartActions.GetCartByIdCart) {
        await this.loadingService.simpleLoader();
        const state = ctx.getState();
        try {
            this.wooApiOrders.retrieveOrder(cartId)
                .pipe(
                    takeUntil(this.ngUnsubscribe),
                    catchError(e => {
                        return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    })
                )
                .subscribe((order: Order) => {
                    console.log('GetCartByIdCart', order);
                    this.loadingService.dismissLoader();
                    return ctx.patchState({
                        ...state,
                        cart: order,
                    });
                });
        } catch (error: any) {
            this.wooHelper.handleError(error);
            this.loadingService.dismissLoader();
        }
    }
    //

    // @Action(CartActions.LoadCartItems)
    // loadCartItems(ctx: StateContext<ICartStateModel>) {
    //     const { lineItems } = ctx.getState();
    //     const products = this.store.selectSnapshot(ProductsState.getProducts);

    //     return joinItems(lineItems, products);
    // }

    @Action(CartActions.UpdateLineItem)
    addLineItem(ctx: StateContext<ICartStateModel>, { product, quantity }: CartActions.UpdateLineItem) {
        const state = ctx.getState();
        const lineItems: any = ctx.getState().lineItems as LineItem[];
        const priceAmount = product.price.replace('.', "");

        const incomingItem: LineItem = {
            name: product.name,
            product_id: product.id,
            quantity,
            price: priceAmount,
        };

        if (lineItems) {
            const saveLineItems = sortLineItems(lineItems, incomingItem);
            console.log(saveLineItems);
            return ctx.patchState({
                ...state,
                lineItems: saveLineItems,
            });
        } else {
            return ctx.patchState({
                ...state,
                lineItems: [incomingItem],
            });
        }
    }

    @Action(CartActions.IncrementLineItem)
    incrementLineItem(ctx: StateContext<ICartStateModel>, { item }: CartActions.IncrementLineItem) {
        const priceAmount = item.price.replace('.', "");
        const incomingItem: LineItem = {
            name: item.name,
            product_id: item.product_id,
            quantity: item.quantity++,
            price: priceAmount,
        };
    }
    @Action(CartActions.DecrementLineItem)
    DecrementLineItem(ctx: StateContext<ICartStateModel>, { item }: CartActions.DecrementLineItem) {
        const priceAmount = item.price.replace('.', "");
        const incomingItem: LineItem = {
            name: item.name,
            product_id: item.id,
            quantity: item.quantity != 0 ? item.quantity-- : 0,
            price: priceAmount,
        };
    }

    @Action(CartActions.RemoveLineItem)
    removeProductFromCart(ctx: StateContext<ICartStateModel>, { item }: CartActions.RemoveLineItem) {
        const lineItems = ctx.getState().lineItems;
        lineItems.forEach((resItem: LineItem, index) => {
            if (resItem.product_id === item.product_id) {
                lineItems.splice(index, 1);
            }
        });
    }

    @Action(CartActions.ClearCartFromState)
    clearCartOrder(ctx: StateContext<ICartStateModel>) {
        return ctx.patchState({
            cart: null,
            lineItems: null,
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}

export function joinItems(cartItems: any, products: any) {
    return cartItems.map((cartItem: any) => {
        const product = products.find((p: any) => p.id === cartItem.productId);
        return {
            ...cartItem,
            ...product,
            total: cartItem.quantity * product.price
        };
    });
}

export const sortLineItems = (lineItems: LineItem[], lineItem: LineItem): LineItem[] => {
    console.log(lineItems, lineItem);
    let line_items;
    if (lineItems.length > 0) {
        lineItems.forEach((item: LineItem) => {
            if (item.product_id === lineItem.product_id) {
                line_items = [
                    {
                        name: lineItem.name,
                        product_id: lineItem.product_id,
                        quantity: lineItem.quantity,
                        price: item.price,
                    },
                ];
            } else {
                line_items = [
                    {
                        name: lineItem.name,
                        product_id: lineItem.product_id,
                        quantity: lineItem.quantity,
                        price: lineItem.price,
                    },
                ];
            }
            // console.log(item);
        });
    } else {
        line_items = [
            {
                name: lineItem.name,
                product_id: lineItem.product_id,
                quantity: lineItem.quantity,
                price: lineItem.price,
            },
        ];
    }

    return line_items
}