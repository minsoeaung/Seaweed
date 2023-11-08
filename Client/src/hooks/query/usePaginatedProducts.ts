import {ApiClient} from "../../api/apiClient.tsx";
import {useQuery} from "react-query";
import {PRODUCTS} from "../../constants/queryKeys.ts";
import {PagedResponse} from "../../types/pagedResponse.ts";
import {Product} from "../../types/product.ts";
import {useState} from "react";

const fetchProducts = async (pageNumber: number): Promise<PagedResponse<Product>> =>
    await ApiClient().get(`api/Products?pageNumber=${pageNumber}&pageSize=25`);

export const usePaginatedProducts = (initialPageNumber: number = 1) => {
    const [pageNumber, setPageNumber] = useState(
        ((!isNaN(initialPageNumber) && initialPageNumber > 0) ? initialPageNumber : 1)
    );

    return {
        ...useQuery(
            [PRODUCTS, pageNumber],
            async () => await fetchProducts(pageNumber),
            {
                refetchOnMount: false,
                refetchOnWindowFocus: false,
                keepPreviousData: true,
            }
        ),
        setPageNumber
    }
}