import {Product} from "./product.ts";

export type WishListItem = {
    userId: number;
    productId: number;
    product: Omit<Product, 'category'>
}