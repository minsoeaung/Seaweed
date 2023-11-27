import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';
import { ADDRESSES } from '../../constants/queryKeys.ts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { CreateAddressDto } from '../../types/createAddressDto.ts';
import { AddressDetails } from '../../types/addressDetails.ts';
import { useAuth } from '../../context/AuthContext.tsx';

type CreateType = {
    type: 'CREATE';
    pushOnSuccess?: string;
    payload: CreateAddressDto;
};

type DeleteType = {
    type: 'DELETE';
    id: number;
    pushOnSuccess?: string;
};

type UpdateType = {
    type: 'UPDATE';
    id: number;
    pushOnSuccess?: string;
    payload: CreateAddressDto;
};

export const useAddressCUD = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();

    return useMutation(
        async (data: CreateType | UpdateType | DeleteType) => {
            const type = data.type;

            if (type === 'CREATE') {
                return await ApiClient.post<never, AddressDetails>(`api/Addresses`, data.payload);
            } else if (type === 'UPDATE') {
                return await ApiClient.put<never, AddressDetails>(`api/Addresses/${data.id}`, data.payload);
            } else if (type === 'DELETE') {
                return await ApiClient.delete<never, never>(`api/Addresses/${data.id}`);
            }
        },
        {
            onSuccess: async (_, data) => {
                toast({
                    title: 'Success',
                    status: 'success',
                    isClosable: true,
                });

                if (!!data.pushOnSuccess) {
                    navigate(data.pushOnSuccess);
                }

                await queryClient.invalidateQueries([ADDRESSES, String(user?.id)]);
            },
        }
    );
};
