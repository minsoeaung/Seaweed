import {useQuery} from "react-query";
import {CART} from "../../constants/queryKeys.ts";
import {ApiClient} from "../../api/apiClient.tsx";
import {CartResponse} from "../../types/cartResponse.ts";

export const useCart = () => {
    return useQuery(
        CART,
        async () => await ApiClient.get<never, CartResponse>("api/Cart"),
    )
}