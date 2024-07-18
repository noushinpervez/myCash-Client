import Cookies from 'js-cookie'
import ErrorToast from '../components/ErrorToast'

const logout = async (axiosPublic, toastTitle = 'Logged out successfully') => {
    let icon = 'success';
    if (toastTitle !== 'Logged out successfully') {
        icon = 'error';
    }

    try {
        await axiosPublic.post('/logout', {}, { withCredentials: true });
        Cookies.remove('user');
        Cookies.remove('token');
        ErrorToast.fire({
            icon: icon,
            title: toastTitle,
        });
    } catch (error) {
        console.error('Logout failed:', error);
        ErrorToast.fire({
            icon: 'error',
            title: error,
        });
    }
};

export default logout;