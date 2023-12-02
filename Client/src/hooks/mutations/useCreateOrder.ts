import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';
import { ADDRESSES, CART, ORDERS } from '../../constants/queryKeys.ts';
import { CreateAddressDto } from '../../types/createAddressDto.ts';
import { AddressDetails } from '../../types/addressDetails.ts';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

type Arg1 = {
    addressId: number;
    address: null;
};

type Arg2 = {
    addressId: null;
    address: CreateAddressDto;
    isDefault: boolean;
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const toast = useToast();
    const navigate = useNavigate();

    return useMutation(
        async (data: Arg1 | Arg2) => {
            let addressId = data.addressId;

            if (data.addressId === null) {
                const addressDetails = await ApiClient.post<never, AddressDetails>(`api/Addresses`, data.address);
                if (data.isDefault) {
                    await ApiClient.put(`api/Addresses/change-default-address?id=${addressDetails.id}`);
                }
                addressId = addressDetails.id;
            }

            return await ApiClient.post<never, void>(`api/Order?addressId=${addressId}`);
        },
        {
            onSuccess: async (_, data) => {
                toast({
                    title: 'Success',
                    status: 'success',
                    isClosable: true,
                });

                if (!data.addressId) {
                    await queryClient.invalidateQueries(ADDRESSES);
                }

                await queryClient.invalidateQueries(CART);
                await queryClient.invalidateQueries(ORDERS);
                navigate('/user/my-orders');
            },
        }
    );
};
