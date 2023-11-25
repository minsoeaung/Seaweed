import { useMutation, useQueryClient } from 'react-query';
import { useToast } from '@chakra-ui/react';
import { ApiClient } from '../../api/apiClient.tsx';
import { MY_REVIEW, PRODUCT_DETAILS } from '../../constants/queryKeys.ts';
import { Review } from '../../types/review.ts';

type Payload = {
    rating: number;
    review: string;
    productId: number;
};

type UpdateType = {
    type: 'UPDATE';
    payload: Payload;
};

type EditType = {
    type: 'CREATE';
    payload: Payload;
};

type DeleteType = {
    type: 'DELETE';
    productId: number;
};

export const useReviewCUD = () => {
    const toast = useToast();
    const queryClient = useQueryClient();

    return useMutation(
        async (data: UpdateType | EditType | DeleteType) => {
            if (data.type == 'DELETE') {
                return await ApiClient.delete<never, unknown>(`api/Reviews?productId=${data.productId}`);
            } else {
                return await ApiClient.put<never, Review>('api/Reviews', data.payload);
            }
        },
        {
            onSuccess: async (response, data) => {
                toast({
                    title: 'Success',
                    status: 'success',
                    isClosable: true,
                });

                if (data.type === 'DELETE') {
                    // queryClient.removeQueries() do not trigger re-render
                    queryClient.setQueryData([MY_REVIEW, String(data.productId)], null);
                    await queryClient.invalidateQueries([PRODUCT_DETAILS, String(data.productId)]);
                } else {
                    queryClient.setQueryData([MY_REVIEW, String(data.payload.productId)], response);
                    await queryClient.invalidateQueries([PRODUCT_DETAILS, String(data.payload.productId)]);
                }
            },
        }
    );
};
