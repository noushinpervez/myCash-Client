import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const usePendingTransactions = (email, page) => {
    const axiosSecure = useAxiosSecure();

    return useQuery({
        queryKey: ['pendingTransactions', email, page],
        queryFn: async () => {
            const response = await axiosSecure.get('/transactions/pending', {
                params: { email, status: 'pending', page },
                withCredentials: true,
            });
            return response.data;
        },
        enabled: !!email, 
        keepPreviousData: true,
    });
};

export default usePendingTransactions;