import {useMutation, useQueryClient} from "react-query";
import {ApiClient} from "../../api/apiClient.tsx";
import {PRODUCT_DETAILS, PRODUCTS} from "../../constants/queryKeys.ts";
import {useNavigate} from "react-router-dom";
import {CreateProductDto} from "../../types/createProductDto.ts";
import {Product} from "../../types/product.ts";

type CreateType = {
    type: "CREATE",
    pushOnSuccess?: string;
    product: CreateProductDto;
}

type DeleteType = {
    type: "DELETE",
    id: number;
    pushOnSuccess?: string;
}

type UpdateType = {
    type: "UPDATE",
    id: number;
    product: Partial<CreateProductDto>;
    pushOnSuccess?: string;
}

export const useProductCUD = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation(
        async (data: CreateType | UpdateType | DeleteType) => {
            const type = data.type;

            const formData = new FormData();

            if (type === "CREATE") {
                const keys = Object.keys(data.product) as Array<keyof typeof data.product>;

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];

                    if (key === "album" || key === "picture")
                        continue;

                    if (data.product[key]) {
                        formData.set(key, String(data.product[key]));
                    }
                }

                return await ApiClient.post<never, Omit<Product, "category" | "brand">>(`api/Products`, formData);
            } else if (type === "UPDATE") {
                const keys = Object.keys(data.product) as Array<keyof typeof data.product>;

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];

                    if (key === "album" || key === "picture")
                        continue;

                    if (data.product[key]) {
                        formData.set(key, String(data.product[key]));
                    }
                }

                return await ApiClient.put<never, Omit<Product, "category" | "brand">>(`api/Products/${data.id}`, formData)
            } else if (type === "DELETE") {
                return await ApiClient.delete<never, undefined>(`api/Products/${data.id}`)
            }
        },
        {
            onSuccess: async (_, data) => {
                await queryClient.invalidateQueries({refetchInactive: true, queryKey: PRODUCTS});  // This is heavy

                if (!!data.pushOnSuccess)
                    navigate(data.pushOnSuccess);

                if (data.type === "DELETE")
                    queryClient.removeQueries([PRODUCT_DETAILS, String(data.id)]);

                if (data.type === "UPDATE")
                    await queryClient.invalidateQueries([PRODUCT_DETAILS, String(data.id)])

            }
        }
    )
}