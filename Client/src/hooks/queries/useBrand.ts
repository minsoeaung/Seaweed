import {useQuery} from "react-query";
import {BRANDS} from "../../constants/queryKeys.ts";
import {ApiClient} from "../../api/apiClient.tsx";
import {NamedApiResource} from "../../types/namedApiResource.ts";

export const useBrand = (id: number) => {
    return useQuery(
        [BRANDS, String(id)],
        async () => await ApiClient.get<never, NamedApiResource>(`api/Products/brands/${id}`),
        {
            enabled: id > 0
        }
    );
}