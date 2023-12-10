import { useMutation } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext.tsx';

export const useDeleteAccount = () => {
    const toast = useToast();
    const { user, logout } = useAuth();

    return useMutation(
        async (password: string) => {
            return await ApiClient.delete<never, never>(`api/Accounts/${user?.id}?password=${password}`);
        },
        {
            onSuccess: async () => {
                await logout();

                toast({
                    title: 'Account deleted',
                    status: 'success',
                    isClosable: true,
                });
            },
        }
    );
};
