import {useMutation, useQueryClient} from "react-query";
import {ApiClient} from "../../api/apiClient.tsx";
import {WISHLIST} from "../../constants/queryKeys.ts";

export const useToggleWishList = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({productId, type}: { productId: number, type: "ADD" | "REMOVE" }) => {
            if (type === "ADD") {
                return await ApiClient.post(`api/WishList?productId=${productId}`);
            } else {
                return await ApiClient.delete(`api/WishList?productId=${productId}`);
            }
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(WISHLIST);
            }
        }
    )
}