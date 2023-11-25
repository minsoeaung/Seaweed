import { QueryFunction, useInfiniteQuery } from 'react-query';
import { REVIEWS } from '../../constants/queryKeys.ts';
import { ApiClient } from '../../api/apiClient.tsx';
import { Review } from '../../types/review.ts';
import { PagedResponse } from '../../types/pagedResponse.ts';

const fetchReviews: QueryFunction<PagedResponse<Review>, [string, string]> = async ({ pageParam = 1, queryKey }) => {
    const [_, productId] = queryKey;

    return await ApiClient.get<never, PagedResponse<Review>>(
        `api/Reviews?productId=${productId}&pageNumber=${pageParam}&pageSize=10`
    );
};

export const useReviews = (productId: string | undefined) => {
    return useInfiniteQuery([REVIEWS, String(productId)], fetchReviews, {
        enabled: typeof Number(productId) === 'number' && Number(productId) > 0,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.currentPage + 1;
            return nextPage > lastPage.pagination.totalPages ? undefined : nextPage;
        },
    });
};
