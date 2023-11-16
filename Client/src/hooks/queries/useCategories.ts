import {useQuery} from "react-query";
import {CATEGORIES} from "../../constants/queryKeys.ts";
import {ApiClient} from "../../api/apiClient.tsx";
import {NamedApiResource} from "../../types/namedApiResource.ts";

export const useCategories = () => {
    return useQuery(
        CATEGORIES,
        async () => await ApiClient.get<never, NamedApiResource[]>(`api/Categories`),
    );
}