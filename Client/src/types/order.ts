import { User } from './authResponse.ts';
import { AddressDetails } from './addressDetails.ts';

export type Order = {
    id: number;
    userId: number;
    user: User;
    total: number;
    createdAt: string;
    orderAddress: Omit<AddressDetails, 'UserAddressId'>;
    orderItems: OrderItem[];
};

export type OrderItem = {
    id: number;
    orderId: number;
    total: number;
    quantity: number;
    productId: number | null;
};
