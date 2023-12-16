import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';
import { ACCOUNT } from '../../constants/queryKeys.ts';
import { useToast } from '@chakra-ui/react';
import { User } from '../../types/authResponse.ts';

export const useUpdateProfilePicture = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation(
        async (picture: FileList) => {
            const formData = new FormData();
            formData.set('picture', picture[0]);
            return await ApiClient.post<never, never>(`api/Accounts/profile-picture`, formData);
        },
        {
            onSuccess: async () => {
                toast({
                    title: 'Success',
                    status: 'success',
                    isClosable: true,
                });

                const data = queryClient.getQueryData<User>(ACCOUNT);
                
                if (data) {
                    if (!data.profilePicture) {
                        await queryClient.invalidateQueries(ACCOUNT);
                    } else {
                        data.profilePicture = `${data.profilePicture}?time=${Date.now()}`;
                        queryClient.setQueryData(ACCOUNT, data);
                    }
                }
            },
        }
    );
};
