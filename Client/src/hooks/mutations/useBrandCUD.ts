import {useMutation, useQueryClient} from "react-query";
import {ApiClient} from "../../api/apiClient.tsx";
import {BRANDS, PRODUCT_FILTERS} from "../../constants/queryKeys.ts";
import {NamedApiResource} from "../../types/namedApiResource.ts";
import {useNavigate} from "react-router-dom";

type CreateType = {
    type: "CREATE",
    pushOnSuccess?: string;
    brand: {
        name: string;
        files: FileList;
    }
}

type DeleteType = {
    type: "DELETE",
    id: number;
    pushOnSuccess?: string;
}

type UpdateType = {
    type: "UPDATE",
    id: number;
    pushOnSuccess?: string;
    brand: {
        name: string;
        files: FileList | null;
    }
}

export const useBrandCUD = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation(
        async (data: CreateType | UpdateType | DeleteType) => {
            const type = data.type;
            const formData = new FormData();

            if (type === "CREATE") {
                formData.set("name", data.brand.name);
                formData.set("picture", data.brand.files[0]);
                return await ApiClient.post<never, NamedApiResource>(`api/brands`, formData);
            } else if (type === "UPDATE") {
                formData.set("name", data.brand.name);
                if (data.brand.files?.length)
                    formData.set("picture", data.brand.files[0]);
                return await ApiClient.put<never, NamedApiResource>(`api/brands/${data.id}`, formData)
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