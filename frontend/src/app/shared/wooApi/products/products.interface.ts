import { Order, Product } from "../../blogApi/utils/types/wooCommerceTypes";
// import { CartItem } from "./store/cart.state";

export function joinItems(cartItems: Order[], products: Product[]) {
  return cartItems.map(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    return {
      ...cartItem,
      ...product,
      // total: cartItem.q * Number(product?.price),
    };
  });
}

export interface IProduct {
  id: number;
  name?: string;
  slug?: string;
  permalink?: string;
  date_created?: Date;
  date_created_gmt?: Date;
  date_modified?: Date;
  date_modified_gmt?: Date;
  type?: string;
  status?: string;
  featured?: boolean;
  catalog_visibility?: string;
  description?: string;
  short_description?: string;
  sku?: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  date_on_sale_from?: Date;
  date_on_sale_from_gmt?: Date;
  date_on_sale_to?: Date;
  date_on_sale_to_gmt?: Date;
  price_html?: string;
  on_sale?: boolean;
  purchasable?: boolean;
  total_sales?: number;
  virtual?: boolean;
  downloadable?: boolean;
  downloads?: Array<any>;
  download_limit?: number;
  download_expiry?: number;
  external_url?: string;
  button_text?: string;
  tax_status?: string;
  tax_class?: string;
  manage_stock?: boolean;
  stock_quantity?: number;
  in_stock?: boolean;
  backorders?: boolean;
  backorders_allowed?: boolean;
  backordered?: boolean;
  sold_individually?: boolean;
  weight?: string;
  dimensions?: any;
  shipping_required?: boolean;
  shipping_taxable?: boolean;
  shipping_class?: string;
  shipping_class_id?: number;
  reviews_allowed?: boolean;
  average_rating?: string;
  rating_count?: number;
  related_ids?: Array<any>;
  upsell_ids?: Array<any>;
  cross_sell_ids?: Array<any>;
  parent_id?: number;
  purchase_note?: string;
  categories?: Category[];
  tags?: Array<any>;
  attributes?: Array<any>;
  default_attributes?: Array<any>;
  variations?: Array<any>;
  grouped_products?: Array<string>;
  menu_order?: number;
  meta_data?: Array<any>;
  images?: Images[];
  yoast_head: any;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Images {
  id: number;
  date_created: Date;
  date_created_gmt: Date;
  date_modified: Date;
  date_modified_gmt: Date;
  src: string;
  name: string;
  alt: string;
  position: number;
}

export interface RetrieveProductsResponse {
  products: IProduct[];
  headers: Array<any>;
}


export enum ProductOrder {
  'desc' = 'desc',
  'asc' = 'asc'
}
export enum ProductOrderBy {
  'date' = 'date',
  'id' = 'id',
  'include' = 'include',
  'title' = 'title',
  'slug' = 'slug'
}

export interface ProductQuery {
  context?: string;
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  exclude?: Array<any>;
  include?: Array<any>;
  offset?: number;
  order?: ProductOrder;
  orderby?: ProductOrderBy | string;
  parent?: Array<string>;
  parent_exclude?: Array<string>;
  slug?: string;
  status?: string;
  type?: string;
  sku?: string;
  featured?: boolean;
  category?: string;
  tag?: string;
  shipping_class?: string;
  attribute?: string;
  attribute_term?: string;
  tax_class?: string;
  in_stock?: boolean;
  on_sale?: boolean;
  min_price?: string;
  max_price?: string;
}

export interface ProductReview {
  id?: number;
  review?: string;
  date_created?: Date;
  date_created_gmt?: Date;
  rating?: number;
  name?: string;
  email?: string;
  verified?: boolean;
}

export interface ProductReviewsResponse {
  product_reviews?: ProductReview[];
}
