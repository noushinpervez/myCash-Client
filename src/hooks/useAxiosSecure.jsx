import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from './useAxiosPublic';
import logout from '../utils/logout';
import { useEffect, useRef, useState } from 'react';

const axiosSecure = axios.create({
    baseURL: 'https://mycash-ten.vercel.app',
});

const useAxiosSecure = () => {
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const user = Cookies.get('user');
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    let token = null;
    const hasLoggedOutRef = useRef(false);

    const handleLogout = async () => {
        if (hasLoggedOutRef.current) return; 
        hasLoggedOutRef.current = true;
        await logout(axiosPublic, 'Session expired. Please log in again.');
        setIsLoggedOut(true);
    };

    if (user) {
        try {
            token = JSON.parse(user);
        } catch (error) {
            handleLogout();
        }
    }

    useEffect(() => {
        if (isLoggedOut) {
            navigate('/login');
        }
    }, [isLoggedOut, navigate]);

    axiosSecure.interceptors.request.use((config) => {
        if (user && token) {
            config.headers['Authorization'] = `Bearer ${token.id}`;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    axiosSecure.interceptors.response.use(
        (response) => {
            return response;
        }, async (error) => {
            const status = error.response.status;
            if (status === 403 || status === 401) {
                await handleLogout();
            }
            return Promise.reject(error);
        }
    );
    return axiosSecure;
};

export default useAxiosSecure;