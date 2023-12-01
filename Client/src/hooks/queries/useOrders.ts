import { useQuery } from 'react-query';
import { ORDERS } from '../../constants/queryKeys.ts';
import { ApiClient } from '../../api/apiClient.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Order } from '../../types/order.ts';

export const useOrders = () => {
    const { user } = useAuth();

    return useQuery(ORDERS, async () => await ApiClient.get<never, Order[]>('api/Order'), {
        enabled: !!user,
    });
};
