import {ApiClient} from "../../api/apiClient.tsx";
import {QueryFunctionContext, useQuery} from "react-query";
import {PRODUCTS} from "../../constants/queryKeys.ts";
import {PagedResponse} from "../../types/pagedResponse.ts";
import {Product} from "../../types/product.ts";

const fetchProducts = async ({queryKey}: QueryFunctionContext<[string, string]>): Promise<PagedResponse<Product>> => {
    const searchParams = new URLSearchParams(queryKey[1]);

    return await ApiClient.get<never, PagedResponse<Product>>(`api/Products?pageNumber=${searchParams.get("pageNumber") || 1}&pageSize=${searchParams.get("pageSize") || 25}&orderBy=${searchParams.get("orderBy") || ""}&brands=${searchParams.get("brands") || ""}&categories=${searchParams.get("categories") || ""}&searchTerm=${searchParams.get("searchTerm") || ""}`);
}

export const usePaginatedProducts = (searchParams: string) => {
    return {
        ...useQuery(
            [PRODUCTS, searchParams],
            fetchProducts,
            {
                keepPreviousData: true
            }
        )
    }
}