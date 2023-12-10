import { useMutation } from 'react-query';
import { ApiClient } from '../../api/apiClient.tsx';

export const useSendVerificationMail = () => {
    return useMutation(async () => {
        return await ApiClient.post(`api/Accounts/send-verification-mail`);
    });
};
