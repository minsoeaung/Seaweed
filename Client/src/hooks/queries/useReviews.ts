import { useQuery } from 'react-query';
import { REVIEWS } from '../../constants/queryKeys.ts';
import { ApiClient } from '../../api/apiClient.tsx';
import { Review } from '../../types/review.ts';

export const useReviews = (productId: string | undefined) => {
    return useQuery(
        [REVIEWS, String(productId)],
        async () => await ApiClient.get<never, Review>(`api/Reviews?productId=${productId}`),
        {
            enabled: typeof Number(productId) === 'number' && Number(productId) > 0,
        }
    );
};
