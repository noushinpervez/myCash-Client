import { useState } from 'react'
import logo from '/logo.svg'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useAxiosPublic from '../hooks/useAxiosPublic'
import useUserData from '../hooks/useUserData'
import useUserDataQuery from '../hooks/useUserDataQuery'

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const user = useUserData();
    const { data: userData } = useUserDataQuery(user?.id);

    const handleLogout = async () => {
        await axiosPublic.post('/logout', {}, { withCredentials: true });
        Cookies.remove('user');
        Cookies.remove('token');
        navigate('/login');
    };

    const activeLinkStyle = {
        transition: 'all 0.2s ease-in-out',
        color: '#fff',
        background: '#2563eb',
    };

    return (
        <div className='flex min-h-screen antialiased text-gray-900 bg-gray-100'>
            <div className={ `fixed inset-y-0 z-50 flex w-80 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` }>
                <svg className='absolute inset-0 w-full h-full text-white' style={ { filter: 'drop-shadow(10px 0 10px #00000030)' } } preserveAspectRatio='none' viewBox='0 0 309 800' fill='currentColor'>
                    <path d='M268.487 0H0V800H247.32C207.957 725 207.975 492.294 268.487 367.647C329 243 314.906 53.4314 268.487 0Z' />
                </svg>
                <div className='z-50 flex flex-col flex-1'>
                    <div className='flex items-center justify-between flex-shrink-0 w-64 p-4'>
                        <Link to='/' className='flex items-center'>
                            <img src={ logo } className='w-16 h-auto' />
                            <p className='text-blue-600 text-lg font-semibold'>MyCash</p>
                        </Link>
                        <button onClick={ () => setIsSidebarOpen(false) } className='p-1 rounded-lg focus:outline-none focus:ring'>
                            <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                            <span className='sr-only'>Close sidebar</span>
                        </button>
                    </div>
                    <nav className='flex flex-col flex-1 w-64 p-4 mt-4 gap-2 font-medium'>
                        <NavLink to='/' className='flex items-center space-x-2 p-3 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out' style={ ({ isActive }) => (isActive ? activeLinkStyle : {}) }>
                            <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                            </svg>
                            <span>Home</span>
                        </NavLink>
                        { userData?.role == 'Admin' &&
                            <NavLink to='/manage-users' className='flex items-center space-x-2 p-3 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out' style={ ({ isActive }) => (isActive ? activeLinkStyle : {}) }>
                                <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' stroke='currentColor'>
                                    <path d='M16 21.916c-4.797 0.020-8.806 3.369-9.837 7.856l-0.013 0.068c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.875-3.885 4.297-6.744 8.386-6.744s7.511 2.859 8.375 6.687l0.011 0.057c0.076 0.34 0.374 0.59 0.732 0.59 0 0 0.001 0 0.001 0h-0c0.057-0 0.112-0.007 0.165-0.019l-0.005 0.001c0.34-0.076 0.59-0.375 0.59-0.733 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005c-1.045-4.554-5.055-7.903-9.849-7.924h-0.002zM9.164 10.602c0 0 0 0 0 0 2.582 0 4.676-2.093 4.676-4.676s-2.093-4.676-4.676-4.676c-2.582 0-4.676 2.093-4.676 4.676v0c0.003 2.581 2.095 4.673 4.675 4.676h0zM9.164 2.75c0 0 0 0 0 0 1.754 0 3.176 1.422 3.176 3.176s-1.422 3.176-3.176 3.176c-1.754 0-3.176-1.422-3.176-3.176v0c0.002-1.753 1.423-3.174 3.175-3.176h0zM22.926 10.602c2.582 0 4.676-2.093 4.676-4.676s-2.093-4.676-4.676-4.676c-2.582 0-4.676 2.093-4.676 4.676v0c0.003 2.581 2.095 4.673 4.675 4.676h0zM22.926 2.75c1.754 0 3.176 1.422 3.176 3.176s-1.422 3.176-3.176 3.176c-1.754 0-3.176-1.422-3.176-3.176v0c0.002-1.753 1.423-3.174 3.176-3.176h0zM30.822 19.84c-0.878-3.894-4.308-6.759-8.406-6.759-0.423 0-0.839 0.031-1.246 0.089l0.046-0.006c-0.049 0.012-0.092 0.028-0.133 0.047l0.004-0.002c-0.751-2.129-2.745-3.627-5.089-3.627-2.334 0-4.321 1.485-5.068 3.561l-0.012 0.038c-0.017-0.004-0.030-0.014-0.047-0.017-0.359-0.053-0.773-0.084-1.195-0.084-0.002 0-0.005 0-0.007 0h0c-4.092 0.018-7.511 2.874-8.392 6.701l-0.011 0.058c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.737-3.207 3.56-5.565 6.937-5.579h0.002c0.335 0 0.664 0.024 0.985 0.070l-0.037-0.004c-0.008 0.119-0.036 0.232-0.036 0.354 0.006 2.987 2.429 5.406 5.417 5.406s5.411-2.419 5.416-5.406v-0.001c0-0.12-0.028-0.233-0.036-0.352 0.016-0.002 0.031 0.005 0.047 0.001 0.294-0.044 0.634-0.068 0.98-0.068 0.004 0 0.007 0 0.011 0h-0.001c3.379 0.013 6.203 2.371 6.93 5.531l0.009 0.048c0.076 0.34 0.375 0.589 0.732 0.59h0c0.057-0 0.112-0.007 0.165-0.019l-0.005 0.001c0.34-0.076 0.59-0.375 0.59-0.733 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005zM16 18.916c-0 0-0 0-0.001 0-2.163 0-3.917-1.753-3.917-3.917s1.754-3.917 3.917-3.917c2.163 0 3.917 1.754 3.917 3.917 0 0 0 0 0 0.001v-0c-0.003 2.162-1.754 3.913-3.916 3.916h-0z' />
                                </svg>
                                <span>Manage Users</span>
                            </NavLink>
                        }
                    </nav>
                    <div className='flex-shrink-0 p-4'>
                        <button onClick={ handleLogout } className='flex items-center space-x-2 font-medium'>
                            <svg aria-hidden='true' className='w-6 h-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
            <main className='flex flex-col items-center justify-center flex-1'>
                <button onClick={ () => setIsSidebarOpen(true) } className='fixed p-2 text-white bg-blue-600 rounded-lg top-5 left-5'>
                    <svg className='w-6 h-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
                    </svg>
                    <span className='sr-only'>Open menu</span>
                </button>
                <Outlet />
            </main>
        </div>
    );
};

export default Sidebar;