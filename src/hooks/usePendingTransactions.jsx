import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import { useUserData } from '../Provider/UserProvider';

const usePendingTransactions = (email, number, page) => {
    const axiosSecure = useAxiosSecure();
    const { user } = useUserData();

    return useQuery({
        queryKey: ['pendingTransactions', email, number, page],
        queryFn: async () => {
            if (user?.role !== 'Agent') {
                return { transactions: [], totalCount: 0 };
            }

            const response = await axiosSecure.get('/pending', {
                params: { email, number, status: 'pending', page },
                withCredentials: true,
            });
            return response.data;
        },
        enabled: user?.role === 'Agent' && !!email,
        keepPreviousData: true,
    });
};

export default usePendingTransactions;