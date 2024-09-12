import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useUserDataQuery = (userId) => {
    const axiosSecure = useAxiosSecure();

    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const response = await axiosSecure.get(`/users/${userId}`, {
                withCredentials: true,
            });
            return response.data;
        },
        enabled: !!userId,
    });
};

export default useUserDataQuery;