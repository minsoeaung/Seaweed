import {useQuery} from "react-query";
import {CATEGORIES} from "../../constants/queryKeys.ts";
import {ProductFilterDto} from "../../types/productFilterDto.ts";
import {ApiClient} from "../../api/apiClient.tsx";

const useCategories = () => useQuery(
    CATEGORIES,
    async (): Promise<ProductFilterDto> => await ApiClient().get("api/Products/filters"),
    {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    }
)

export default useCategories;