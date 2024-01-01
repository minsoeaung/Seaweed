import { useQuery } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';

export const useIsSignedIn   = () => {
    return useQuery('IS_SIGNED_IN', async () => await ApiClient.get<never, boolean>(`api/Accounts/is-signed-in`));
};
