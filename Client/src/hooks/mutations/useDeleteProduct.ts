import {useMutation, useQueryClient} from "react-query";
import {ApiClient} from "../../api/apiClient.tsx";
import {PRODUCTS} from "../../constants/queryKeys.ts";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (productId: number) => {
            return await ApiClient.delete<never, void>(`api/Products?productId=${productId}`);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(PRODUCTS);
            }
        }
    )
}