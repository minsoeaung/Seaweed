import { useQuery } from 'react-query';
import { BRANDS } from '../../constants/queryKeys.ts';
import { ApiClient } from '../../api/apiClient.tsx';
import { NamedApiResource } from '../../types/namedApiResource.ts';

export const useBrands = () => {
    return useQuery(BRANDS, async () => await ApiClient.get<never, NamedApiResource[]>(`api/Brands`));
};
