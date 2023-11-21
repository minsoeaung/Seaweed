import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';
import { CATEGORIES, PRODUCT_FILTERS } from '../../constants/queryKeys.ts';
import { NamedApiResource } from '../../types/namedApiResource.ts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

type CreateType = {
    type: 'CREATE';
    pushOnSuccess?: string;
    category: {
        name: string;
        files: FileList;
    };
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
    category: {
        name: string;
        files: FileList | null;
    };
};

export const useCategoryCUD = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const toast = useToast();

    return useMutation(
        async (data: CreateType | UpdateType | DeleteType) => {
            const type = data.type;
            const formData = new FormData();

            if (type === 'CREATE') {
                formData.set('name', data.category.name);
                formData.set('picture', data.category.files[0]);
                return await ApiClient.post<never, NamedApiResource>(`api/categories`, formData);
            } else if (type === 'UPDATE') {
                formData.set('name', data.category.name);
                if (data.category.files?.length) formData.set('picture', data.category.files[0]);
                return await ApiClient.put<never, NamedApiResource>(`api/categories/${data.id}`, formData);
            } else if (type === 'DELETE') {
                return await ApiClient.delete<never, never>(`api/categories/${data.id}`);
            }
        },
        {
            onSuccess: async (_, data) => {
                toast({
                    title: 'Success',
                    status: 'success',
                    isClosable: true,
                });

                await queryClient.invalidateQueries({ refetchInactive: true, queryKey: PRODUCT_FILTERS });
                await queryClient.invalidateQueries({ refetchInactive: true, queryKey: CATEGORIES });

                if (!!data.pushOnSuccess) navigate(data.pushOnSuccess);

                if (data.type === 'DELETE') queryClient.removeQueries([CATEGORIES, String(data.id)]);

                if (data.type === 'UPDATE') await queryClient.invalidateQueries([CATEGORIES, String(data.id)]);
            },
        }
    );
};
