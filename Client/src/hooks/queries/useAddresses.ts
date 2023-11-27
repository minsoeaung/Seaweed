import { useQuery } from 'react-query';
import { ADDRESSES } from '../../constants/queryKeys.ts';
import { ApiClient } from '../../api/apiClient.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { AddressDetails } from '../../types/addressDetails.ts';

export const useAddresses = () => {
    const { user } = useAuth();

    return useQuery(
        [ADDRESSES, String(user?.id)],
        async () => await ApiClient.get<never, AddressDetails[]>(`api/Addresses`),
        {
            enabled: !!user,
        }
    );
};
