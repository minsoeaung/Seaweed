import {useMutation, useQueryClient} from "react-query";
import {ApiClient} from "../../api/apiClient.tsx";
import {CART} from "../../constants/queryKeys.ts";

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({productId, quantity}: { productId: number, quantity: number }) => {
            if (quantity <= 0) {
                return await ApiClient.delete<never, void>(`api/Cart?productId=${productId}`);
            } else {
                return await ApiClient.post<never, void>(`api/Cart?productId=${productId}&quantity=${quantity}`);
            }
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(CART);
            },
        }
    )
}