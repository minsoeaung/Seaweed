import {useQuery} from "react-query";
import {WISHLIST} from "../../constants/queryKeys.ts";
import {ApiClient} from "../../api/apiClient.tsx";
import {WishListItem} from "../../types/wishListitem.ts";

export const useWishList = () => {
    return useQuery(
        WISHLIST,
        async () => await ApiClient.get<never,WishListItem[]>("api/WishList"),
    )
}