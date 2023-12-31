import { useQuery } from 'react-query';
import { MY_REVIEW } from '../../constants/queryKeys.ts';
import { ApiClient } from '../../api/apiClient.tsx';
import { Review } from '../../types/review.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export const useMyReview = (productId: string | undefined) => {
    const { user } = useAuth();

    return useQuery(
        [MY_REVIEW, String(productId)],
        async () => await ApiClient.get<never, Review>(`api/Reviews/me?productId=${productId}`),
        {
            enabled: typeof Number(productId) === 'number' && Number(productId) > 0 && !!user,
        }
    );
};
