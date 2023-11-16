import {useQuery} from "react-query";
import {PRODUCT_DETAILS} from "../../constants/queryKeys.ts";
import {ApiClient} from "../../api/apiClient.tsx";
import {Product} from "../../types/product.ts";

export const useProductDetails = (id: string | undefined) => {
    return useQuery(
        [PRODUCT_DETAILS, String(id)],
        async () => await ApiClient.get<never, Product>(`api/Products/${id}`),
        {
            enabled: typeof Number(id) === "number" && Number(id) > 0
        }
    )
}