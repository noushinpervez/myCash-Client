import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

const useUserData = () => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = Cookies.get('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            queryClient.setQueryData('user', parsedUser);
        }
    }, [queryClient]);

    return user;
};

export default useUserData;