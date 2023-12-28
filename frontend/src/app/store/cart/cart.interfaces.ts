import { Product } from "src/app/shared/blogApi/utils/types/wooCommerceTypes";

export class CartItem {
  productId: Product["id"];
  quantity: number;
  total: number;
  id?: number;
  emoji?: string;
  name?: string;
  price?: number;
}

export function createCartItem(params: Partial<CartItem>, quantity: number) {
  return {
    total: 0,
    quantity: quantity,
    ...params
  } as CartItem;
}