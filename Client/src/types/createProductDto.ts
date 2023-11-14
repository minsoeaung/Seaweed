export type CreateProductDto = {
    name: string;
    sku: string;
    description: string;
    picture: File[] | null;
    album: File[] | null;
    price: number;
    quantityInStock: number;
    categoryId: number;
    brandId: number;
}