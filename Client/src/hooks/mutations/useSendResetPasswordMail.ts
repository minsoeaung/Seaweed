import { useMutation } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';

type Payload = {
    email: string;
    clientUrl: string;
};

export const useSendResetPasswordMail = () => {
    return useMutation(async (payload: Payload) => {
        return await ApiClient.post<never, never>(
            `api/Accounts/send-reset-password-mail?email=${payload.email}&clientUrl=${payload.clientUrl}`
        );
    });
};
