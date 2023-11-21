import { useQuery } from 'react-query';
import { PRODUCT_FILTERS } from '../../constants/queryKeys.ts';
import { ProductFilterDto } from '../../types/productFilterDto.ts';
import { ApiClient } from '../../api/apiClient.tsx';

const useProductFilters = () =>
    useQuery(PRODUCT_FILTERS, async () => await ApiClient.get<never, ProductFilterDto>('api/Products/filters'), {
        refetchOnMount: false,
    });

export default useProductFilters;
