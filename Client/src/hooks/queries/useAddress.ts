import { useQuery } from 'react-query';
import { ADDRESSES } from '../../constants/queryKeys.ts';
import { ApiClient } from '../../api/apiClient.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { AddressDetails } from '../../types/addressDetails.ts';

export const useAddress = (addressId: number) => {
    const { user } = useAuth();

    return useQuery(
        [ADDRESSES, String(user?.id), String(addressId)],
        async () => await ApiClient.get<never, AddressDetails>(`api/Addresses/${addressId}`),
        {
            enabled: !!user && !!addressId,
        }
    );
};
