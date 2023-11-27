import { useQuery } from 'react-query';
import { COUNTRIES } from '../../constants/queryKeys.ts';
import { ApiClient } from '../../api/apiClient.tsx';
import { Country } from '../../types/country.ts';

export const useCountries = () => {
    return useQuery(COUNTRIES, async () => await ApiClient.get<never, Country[]>('api/Countries'), {
        refetchOnMount: false,
    });
};
