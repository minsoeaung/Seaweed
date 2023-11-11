import {Product} from "./product.ts";

export type CartResponse = {
    total: number;
    cartItems: CartItem[]
}


export type CartItem = {
    id: number;
    total: number;
    quantity: number;
    product: Product;
}