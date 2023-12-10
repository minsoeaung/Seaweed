import { useMutation } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';

type Payload = {
    email: string;
    token: string;
    newPassword: string;
};

export const useResetPassword = () => {
    return useMutation(async (payload: Payload) => {
        payload.token = encodeURIComponent(payload.token);
        return await ApiClient.post<never, never>(`api/Accounts/reset-password`, payload);
    });
};
