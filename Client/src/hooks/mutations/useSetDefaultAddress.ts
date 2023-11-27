import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';
import { ADDRESSES } from '../../constants/queryKeys.ts';

export const useSetDefaultAddress = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id: number) => {
            return await ApiClient.put(`api/Addresses/change-default-address?id=${id}`);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(ADDRESSES);
            },
        }
    );
};
