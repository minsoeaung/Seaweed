import {useMutation, useQueryClient} from "react-query";
import {ApiClient} from "../../api/apiClient.tsx";
import {PRODUCTS} from "../../constants/queryKeys.ts";
import {CreateProductDto} from "../../types/createProductDto.ts";
import {Product} from "../../types/product.ts";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (body: CreateProductDto) => {

            const keys = Object.keys(body);
            const formData = new FormData();

            keys.forEach(k => {
                const key = k as keyof CreateProductDto;
                if (key === "album") {
                    const files = body[key];
                    if (files && files.length > 0) {
                        for (let i = 0; i < files.length; i++) {
                            formData.append(key, files[i]);
                        }
                    }
                } else if (key === "picture") {
                    const files = body[key];
                    if (files && files.length > 0) {
                        formData.set(key, files[0]);
                    }
                } else if (body[key]) {
                    formData.set(key, String(body[key]));
                }
            })

            return await ApiClient.post<never, Omit<Product, "category" | "brand">>(`api/Products`, formData);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(PRODUCTS);
            }
        }
    )
}