import {useMutation, useQueryClient} from "react-query";
import {ApiClient} from "../../api/apiClient.tsx";
import {BRANDS, PRODUCT_FILTERS} from "../../constants/queryKeys.ts";
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

export const useBrandCUD = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation(
        async (data: CreateType | UpdateType | DeleteType) => {
            const type = data.type;

            if (type === "CREATE") {
                return await ApiClient.post<never, NamedApiResource>(`api/brands?name=${data.name}`);
            } else if (type === "UPDATE") {
                return await ApiClient.put<never, NamedApiResource>(`api/brands/${data.id}?name=${data.name}`)
            } else if (type === "DELETE") {
                return await ApiClient.delete<never, never>(`api/brands/${data.id}`)
            }
        },
        {
            onSuccess: async (_, data) => {
                await queryClient.invalidateQueries({refetchInactive: true, queryKey: PRODUCT_FILTERS});
                await queryClient.invalidateQueries({refetchInactive: true, queryKey: BRANDS});

                if (!!data.pushOnSuccess)
                    navigate(data.pushOnSuccess);

                if (data.type === "DELETE")
                    queryClient.removeQueries([BRANDS, String(data.id)]);

                if (data.type === "UPDATE")
                    await queryClient.invalidateQueries([BRANDS, String(data.id)])

            }
        }
    )
}