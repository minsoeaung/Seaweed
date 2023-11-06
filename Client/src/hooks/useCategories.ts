import {useQuery} from "react-query";
import {ApiClient} from "../api/apiClient.tsx";
import {CATEGORIES} from "../constants/queryKeys.ts";
import {ProductFilterDto} from "../types/productFilterDto.ts";

const useCategories = () => useQuery(
    CATEGORIES,
    async (): Promise<ProductFilterDto> => await ApiClient().get("api/Products/filters"),
    {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    }
)

export default useCategories;