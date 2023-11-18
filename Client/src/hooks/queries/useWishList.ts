import {useQuery} from "react-query";
import {WISHLIST} from "../../constants/queryKeys.ts";
import {ApiClient} from "../../api/apiClient.tsx";
import {WishListItem} from "../../types/wishListitem.ts";
import {useAuth} from "../../context/AuthContext.tsx";

export const useWishList = () => {
    const {user} = useAuth();

    return useQuery(
        WISHLIST,
        async () => await ApiClient.get<never, WishListItem[]>("api/WishList"),
        {
            enabled: !!user
        }
    )
}