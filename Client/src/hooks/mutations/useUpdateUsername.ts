import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';
import { ACCOUNT } from '../../constants/queryKeys.ts';
import { useToast } from '@chakra-ui/react';

export const useUpdateUsername = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation(
        async (newName: string) => {
            return await ApiClient.post<never, never>(`api/Accounts/username?username=${newName.trim()}`);
        },
        {
            onSuccess: async () => {
                toast({
                    title: 'Success',
                    status: 'success',
                    isClosable: true,
                });
                await queryClient.invalidateQueries(ACCOUNT);
            },
        }
    );
};
