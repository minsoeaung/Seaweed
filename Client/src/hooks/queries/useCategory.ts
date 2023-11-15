import {useQuery} from "react-query";
import {CATEGORIES} from "../../constants/queryKeys.ts";
import {ApiClient} from "../../api/apiClient.tsx";
import {NamedApiResource} from "../../types/namedApiResource.ts";

export const useCategory = (id: number) => {
    return useQuery(
        [CATEGORIES, String(id)],
        async () => await ApiClient.get<never, NamedApiResource>(`api/Products/categories/${id}`),
        {
            enabled: id > 0
        }
    );
}