import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = () => {
        const token = Cookies.get('user');

        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                const { id, role } = decodedUser;
                setUser({ id, role });
            } catch (error) {
                console.error('Error decoding token', error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const refetchUserData = async () => {
        setLoading(true);
        fetchUser();
    };

    return <UserContext.Provider value={ { user, loading, refetchUserData } }>
        { children }
    </UserContext.Provider>
};

UserProvider.propTypes = {
    children: PropTypes.node,
};

export const useUserData = () => useContext(UserContext);