import { useQuery } from 'react-query';
import { ACCOUNT } from '../../constants/queryKeys.ts';
import { ApiClient } from '../../api/apiClient.tsx';
import { User } from '../../types/authResponse.ts';

export const useMyAccount = () => {
    return useQuery(ACCOUNT, async () => await ApiClient.get<never, User>('api/Accounts/me'));
};
