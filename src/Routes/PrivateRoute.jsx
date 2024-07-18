import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAxiosPublic from '../hooks/useAxiosPublic'
import Loading from '../components/Loading'
import PropTypes from 'prop-types'

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const axiosPublic = useAxiosPublic();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axiosPublic.get('/protected', { withCredentials: true });
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, [axiosPublic]);

    if (isAuthenticated === null) {
        return <Loading />;
    }

    return isAuthenticated ? <>{ children }</> : <Navigate to='/login' state={ location?.pathname || '/' }></Navigate>;
};

PrivateRoute.propTypes = {
    children: PropTypes.node,
}

export default PrivateRoute;