import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const fetchUserData = async (axiosPublic) => {
    const response = await axiosPublic.get('/current-user', { withCredentials: true });
    return response.data;
};

const useUserData = () => {
    const axiosPublic = useAxiosPublic();
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => fetchUserData(axiosPublic)
    });
};

export default useUserData;