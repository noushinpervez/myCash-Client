import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';

const useUserData = () => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('user');
        if (token) {
            const decodedUser = jwtDecode(token);
            const { id, role } = decodedUser;
            setUser({id,role});
            queryClient.setQueryData('user', { id, role });
        }
        setLoading(false);
    }, [queryClient]);

    const refetchUserData = async () => {
        try {
            await queryClient.invalidateQueries('user');
        } catch (error) {
            console.error('Error refetching user data:', error);
        }
    };
    
    return { user, loading, refetchUserData };
};

export default useUserData;