import {ApiClient} from "../../api/apiClient.tsx";
import {QueryFunctionContext, useQuery} from "react-query";
import {PRODUCTS} from "../../constants/queryKeys.ts";
import {PagedResponse} from "../../types/pagedResponse.ts";
import {Product} from "../../types/product.ts";
import {useState} from "react";

const fetchProducts = async ({queryKey}: QueryFunctionContext<[string, number]>): Promise<PagedResponse<Product>> => {
    return await ApiClient.get<never, PagedResponse<Product>>(`api/Products?pageNumber=${queryKey[1]}&pageSize=25`);
}


export const usePaginatedProducts = (initialPageNumber: number = 1) => {
    const [pageNumber, setPageNumber] = useState(
        ((!isNaN(initialPageNumber) && initialPageNumber > 0) ? initialPageNumber : 1)
    );

    return {
        ...useQuery(
            [PRODUCTS, Number(pageNumber)],
            fetchProducts,
            {
                keepPreviousData: true
            }
        ),
        setPageNumber
    }
}