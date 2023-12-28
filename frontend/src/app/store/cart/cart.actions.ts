import { LineItem, Order, Product } from "src/app/shared/blogApi/utils/types/wooCommerceTypes";

export namespace CartActions {
    export class UpdateLineItem {
        static type = "[CartActions] Update Line Item";
        constructor(public readonly product: Product, public quantity: number) { }
    }
    export class IncrementLineItem {
        static readonly type = '[CartActions] Increment Line Item';
        constructor(public item: LineItem) { }
    }
    export class DecrementLineItem {
        static readonly type = '[CartActions] Decrement Line Item';
        constructor(public item: LineItem) { }
    }
    export class RemoveLineItem {
        static readonly type = '[CartActions] Remove Line Item';
        constructor(public item: LineItem) { }
    }
    export class LoadCartItems {
        static type = "[CartActions] Load Cart Items";
    }
    export class UpdateLineItems {
        static readonly type = '[CartActions] Update Line Items';
        constructor(public lineItems: LineItem[], public cutomerId: number) { }
    }
    export class CreateCart {
        static readonly type = '[CartActions] Create Cart';
        constructor(public order: Order) { }
    }
    export class UpdateCartOrder {
        static readonly type = '[CartActions] Update Cart Order';
        constructor(public order: Order) { }
    }
    export class ClearCartFromState {
        static readonly type = '[CartActions] Clear Cart From State';
    }
    export class GetCartByIdCart {
        static readonly type = '[CartActions] Get Cart By Id Cart';
        constructor(public cartId: any) { }
    }
}
