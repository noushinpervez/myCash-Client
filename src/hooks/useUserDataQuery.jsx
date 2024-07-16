import { useQuery } from '@tanstack/react-query'
import useAxiosPublic from './useAxiosPublic'

const useUserDataQuery = (userId) => {
    const axiosPublic = useAxiosPublic();

    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const response = await axiosPublic.get(`/users/${userId}`, {
                withCredentials: true,
            });
            return response.data;
        },
        enabled: !!userId,
    });
};

export default useUserDataQuery;