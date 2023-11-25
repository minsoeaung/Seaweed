import { NamedApiResource } from './namedApiResource.ts';

export type Product = {
    id: number;
    name: string;
    sku: string;
    description: string;
    price: number;
    quantityInStock: number;
    averageRating: number;
    numOfRatings: number;
    categoryId: number;
    category: NamedApiResource;
    brandId: number;
    brand: NamedApiResource;
};
