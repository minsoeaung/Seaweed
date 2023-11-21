import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';
import { PRODUCT_DETAILS, PRODUCTS } from '../../constants/queryKeys.ts';
import { useNavigate } from 'react-router-dom';
import { CreateProductDto } from '../../types/createProductDto.ts';
import { Product } from '../../types/product.ts';
import { useToast } from '@chakra-ui/react';

type CreateType = {
    type: 'CREATE';
    pushOnSuccess?: string;
    product: CreateProductDto;
};

type DeleteType = {
    type: 'DELETE';
    id: number;
    pushOnSuccess?: string;
};

type UpdateType = {
    type: 'UPDATE';
    id: number;
    product: Partial<CreateProductDto>;
    pushOnSuccess?: string;
};

const prepareFormData = (product: Partial<CreateProductDto>): FormData => {
    const keys = Object.keys(product) as Array<keyof typeof product>;

    const formData = new FormData();

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        // Will implement later
        if (key === 'album') continue;

        if (product[key]) {
            if (key === 'picture') {
                const files = product[key];
                if (files?.length) {
                    formData.set(key, files[0]);
                }
            } else {
                formData.set(key, String(product[key]));
            }
        }
    }

    return formData;
};

export const useProductCUD = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const toast = useToast();

    return useMutation(
        async (data: CreateType | UpdateType | DeleteType) => {
            const type = data.type;

            if (type === 'CREATE') {
                return await ApiClient.post<never, Omit<Product, 'category' | 'brand'>>(
                    `api/Products`,
                    prepareFormData(data.product)
                );
            } else if (type === 'UPDATE') {
                return await ApiClient.put<never, Omit<Product, 'category' | 'brand'>>(
                    `api/Products/${data.id}`,
                    prepareFormData(data.product)
                );
            } else if (type === 'DELETE') {
                return await ApiClient.delete<never, undefined>(`api/Products/${data.id}`);
            }
        },
        {
            onSuccess: async (_, data) => {
                toast({
                    title: 'Success',
                    status: 'success',
                    isClosable: true,
                });

                await queryClient.invalidateQueries({ refetchInactive: true, queryKey: PRODUCTS }); // This is heavy

                if (!!data.pushOnSuccess) navigate(data.pushOnSuccess);

                if (data.type === 'DELETE') queryClient.removeQueries([PRODUCT_DETAILS, String(data.id)]);

                if (data.type === 'UPDATE') await queryClient.invalidateQueries([PRODUCT_DETAILS, String(data.id)]);
            },
        }
    );
};
