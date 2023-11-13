import {useQuery} from "react-query";
import {ACCOUNT} from "../../constants/queryKeys.ts";
import {ApiClient} from "../../api/apiClient.tsx";
import {Account} from "../../types/account.ts";

export const useMyAccount = () => {
    return useQuery(
        ACCOUNT,
        async () => await ApiClient.get<never, Account>("api/Accounts/me")
    )
}