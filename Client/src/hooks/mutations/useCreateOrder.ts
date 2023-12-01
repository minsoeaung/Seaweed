import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';
import { CART, ORDERS } from '../../constants/queryKeys.ts';
import { CreateAddressDto } from '../../types/createAddressDto.ts';
import { AddressDetails } from '../../types/addressDetails.ts';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

type Arg1 = {
    addressId: number;
    address?: CreateAddressDto;
};

type Arg2 = {
    addressId?: number;
    address: CreateAddressDto;
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const toast = useToast();
    const navigate = useNavigate();

    return useMutation(
        async (data: Arg1 | Arg2) => {
            let addressId = data.addressId;

            if (!data.addressId) {
                const addressDetails = await ApiClient.post<never, AddressDetails>(`api/Addresses`, data.address);
                addressId = addressDetails.id;
            }

            return await ApiClient.post<never, void>(`api/Order?addressId=${addressId}`);
        },
        {
            onSuccess: async () => {
                toast({
                    title: 'Success',
                    status: 'success',
                    isClosable: true,
                });

                await queryClient.invalidateQueries(CART);
                await queryClient.invalidateQueries(ORDERS);
                navigate('/user/my-orders');
            },
        }
    );
};
