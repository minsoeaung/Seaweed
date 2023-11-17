export type CreateProductDto = {
    name: string;
    sku: string;
    description: string;
    picture: FileList | null;
    album: FileList | null;
    price: number;
    quantityInStock: number;
    categoryId: number;
    brandId: number;
}