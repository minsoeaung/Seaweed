import {useMutation, useQueryClient} from "react-query";
import {ApiClient} from "../../api/apiClient.tsx";
import {CATEGORIES, PRODUCT_FILTERS} from "../../constants/queryKeys.ts";
import {NamedApiResource} from "../../types/namedApiResource.ts";
import {useNavigate} from "react-router-dom";

type CreateType = {
    type: "CREATE",
    name: string;
    pushOnSuccess?: string;
}

type DeleteType = {
    type: "DELETE",
    id: number;
    pushOnSuccess?: string;
}

type UpdateType = {
    type: "UPDATE",
    id: number;
    name: string;
    pushOnSuccess?: string;
}

export const useCategoryCUD = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation(
        async (data: CreateType | UpdateType | DeleteType) => {
            const type = data.type;

            if (type === "CREATE") {
                return await ApiClient.post<never, NamedApiResource>(`api/Products/categories?name=${data.name}`);
            } else if (type === "UPDATE") {
                return await ApiClient.put<never, NamedApiResource>(`api/Products/categories/${data.id}?name=${data.name}`)
            } else if (type === "DELETE") {
                return await ApiClient.delete<never, never>(`api/Products/categories/${data.id}`)
            }
        },
        {
            onSuccess: async (_, data) => {
                await queryClient.invalidateQueries({refetchInactive: true, queryKey: PRODUCT_FILTERS});

                if (!!data.pushOnSuccess)
                    navigate(data.pushOnSuccess);

                if (data.type === "DELETE")
                    queryClient.removeQueries([CATEGORIES, String(data.id)]);

                if (data.type === "UPDATE")
                    await queryClient.invalidateQueries([CATEGORIES, String(data.id)])

            }
        }
    )
}