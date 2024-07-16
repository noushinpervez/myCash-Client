import { useState } from 'react'
import logo from '/logo.svg'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useAxiosPublic from '../hooks/useAxiosPublic';

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axiosPublic.post('/logout', {}, { withCredentials: true });
        Cookies.remove('user');
        Cookies.remove('token');
        navigate('/login');
    };

    return (
        <div className='flex h-screen antialiased text-gray-900 bg-gray-100'>
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
                    <nav className='flex flex-col flex-1 w-64 p-4 mt-4'>
                        <NavLink to='/' className='flex items-center space-x-2'>
                            <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                            </svg>
                            <span>Home</span>
                        </NavLink>
                    </nav>
                    <div className='flex-shrink-0 p-4'>
                        <button onClick={ handleLogout } className='flex items-center space-x-2'>
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