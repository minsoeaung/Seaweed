import {useQuery} from "react-query";
import {CATEGORIES} from "../../constants/queryKeys.ts";
import {ProductFilterDto} from "../../types/productFilterDto.ts";
import {ApiClient} from "../../api/apiClient.tsx";

const useCategories = () => useQuery(
    CATEGORIES,
    async () => await ApiClient.get<never, ProductFilterDto>("api/Products/filters"),
    {
        refetchOnMount: false,
    }
)

export default useCategories;