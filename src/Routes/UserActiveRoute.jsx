import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import PropTypes from 'prop-types';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useUserData from '../hooks/useUserData';
import useUserDataQuery from '../hooks/useUserDataQuery';

const UserActiveRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isActive, setIsActive] = useState(null);
    const axiosPublic = useAxiosPublic();
    const location = useLocation();
    const { user, loading } = useUserData();
    const { data, isLoading } = useUserDataQuery(user?.id);

    useEffect(() => {
        const checkAuthAndStatus = async () => {
            try {
                await axiosPublic.get('/protected', { withCredentials: true });
                setIsAuthenticated(true);
                if (data) {
                    setIsActive(data.status === 'active');
                }
            } catch {
                setIsAuthenticated(false);
            }
        };

        if (user) {
            checkAuthAndStatus();
        }
    }, [axiosPublic, user, data]);

    if (loading || isLoading || isAuthenticated === null || isActive === null) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' state={ { from: location?.pathname || '/' } } />;
    }

    return isActive ? <>{ children }</> : <Navigate to='/' />;
};

UserActiveRoute.propTypes = {
    children: PropTypes.node,
};

export default UserActiveRoute;