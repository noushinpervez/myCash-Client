import { useEffect, useRef, useState } from 'react';
import logo from '/logo.svg';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useUserData from '../hooks/useUserData';
import Loading from '../components/Loading';
import logout from '../utils/logout';
import useUserDataQuery from '../hooks/useUserDataQuery';
import usePendingTransactions from '../hooks/usePendingTransactions';

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const { user, loading } = useUserData();
    const { data, isLoading } = useUserDataQuery(user?.id);
    const sidebarRef = useRef(null);
    const { data: transactionsData = {}, isLoading: transactionLoading } = usePendingTransactions(data?.email);
    const { totalCount = 0 } = transactionsData;

    useEffect(() => {
        if (isSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    const handleLogout = async () => {
        await logout(axiosPublic);
        navigate('/login');
    };

    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    };

    const activeLinkStyle = {
        transition: 'all 0.2s ease-in-out',
        color: '#fff',
        background: '#2563eb',
    };

    if (loading || isLoading || transactionLoading) {
        return <Loading />;
    }

    return (
        <div className='min-h-screen antialiased text-gray-900 bg-gray-100'>
            <div ref={ sidebarRef } className={ `fixed inset-y-0 z-50 flex xl:w-[17%] lg:w-[26%] md:w-[35%] w-[75%] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` }>
                <svg className='absolute inset-0 w-full h-full text-white' style={ { filter: 'drop-shadow(10px 0 10px #00000030)' } } preserveAspectRatio='none' viewBox='0 0 309 800' fill='currentColor'>
                    <path d='M268.487 0H0V800H247.32C207.957 725 207.975 492.294 268.487 367.647C329 243 314.906 53.4314 268.487 0Z' />
                </svg>
                <div className='z-50 flex flex-col flex-1'>
                    <div className='flex items-center justify-between flex-shrink-0 w-[90%] p-4'>
                        <Link to='/' className='flex items-center'>
                            <img src={ logo } className='w-12 md:w-16 h-auto' />
                            <p className='text-blue-600 text-lg font-semibold'>myCash</p>
                        </Link>
                        <button onClick={ () => setIsSidebarOpen(false) } className='p-1 rounded-lg focus:outline-none focus:ring'>
                            <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                            <span className='sr-only'>Close sidebar</span>
                        </button>
                    </div>
                    <div className='flex items-center justify-center w-[75%] px-4 my-2'>
                        <div className='w-full bg-blue-50 text-blue-500 border border-blue-400 font-medium px-3 py-1 rounded-full flex items-center justify-center gap-2'>
                            <svg fill='none' width='64px' height='64px' viewBox='0 0 24 24' className='w-5 h-5' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                                <path stroke='none' d='M0 0h24v24H0z' />
                                <path d='M17.5 15.5 A1 1 0 0 1 16.5 16.5 A1 1 0 0 1 15.5 15.5 A1 1 0 0 1 17.5 15.5 z' />
                                <path d='M7 7a2 2 0 114 0v9a3 3 0 006 0v-.5M8 11h6' />
                            </svg><p>{ data?.balance }</p>
                        </div>
                    </div>
                    <nav className='flex flex-col flex-1 px-4 mt-4 gap-2 font-medium w-[75%]'>
                        <NavLink to='/' className='flex items-center space-x-2 p-3 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out' style={ ({ isActive }) => (isActive ? activeLinkStyle : {}) }>
                            <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                            </svg>
                            <span>Home</span>
                        </NavLink>
                        { user?.role === 'Admin' &&
                            <NavLink to='/manage-users' className='flex items-center space-x-2 p-3 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out' style={ ({ isActive }) => (isActive ? activeLinkStyle : {}) }>
                                <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' stroke='currentColor'>
                                    <path d='M16 21.916c-4.797 0.020-8.806 3.369-9.837 7.856l-0.013 0.068c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.875-3.885 4.297-6.744 8.386-6.744s7.511 2.859 8.375 6.687l0.011 0.057c0.076 0.34 0.374 0.59 0.732 0.59 0 0 0.001 0 0.001 0h-0c0.057-0 0.112-0.007 0.165-0.019l-0.005 0.001c0.34-0.076 0.59-0.375 0.59-0.733 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005c-1.045-4.554-5.055-7.903-9.849-7.924h-0.002zM9.164 10.602c0 0 0 0 0 0 2.582 0 4.676-2.093 4.676-4.676s-2.093-4.676-4.676-4.676c-2.582 0-4.676 2.093-4.676 4.676v0c0.003 2.581 2.095 4.673 4.675 4.676h0zM9.164 2.75c0 0 0 0 0 0 1.754 0 3.176 1.422 3.176 3.176s-1.422 3.176-3.176 3.176c-1.754 0-3.176-1.422-3.176-3.176v0c0.002-1.753 1.423-3.174 3.175-3.176h0zM22.926 10.602c2.582 0 4.676-2.093 4.676-4.676s-2.093-4.676-4.676-4.676c-2.582 0-4.676 2.093-4.676 4.676v0c0.003 2.581 2.095 4.673 4.675 4.676h0zM22.926 2.75c1.754 0 3.176 1.422 3.176 3.176s-1.422 3.176-3.176 3.176c-1.754 0-3.176-1.422-3.176-3.176v0c0.002-1.753 1.423-3.174 3.176-3.176h0zM30.822 19.84c-0.878-3.894-4.308-6.759-8.406-6.759-0.423 0-0.839 0.031-1.246 0.089l0.046-0.006c-0.049 0.012-0.092 0.028-0.133 0.047l0.004-0.002c-0.751-2.129-2.745-3.627-5.089-3.627-2.334 0-4.321 1.485-5.068 3.561l-0.012 0.038c-0.017-0.004-0.030-0.014-0.047-0.017-0.359-0.053-0.773-0.084-1.195-0.084-0.002 0-0.005 0-0.007 0h0c-4.092 0.018-7.511 2.874-8.392 6.701l-0.011 0.058c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.737-3.207 3.56-5.565 6.937-5.579h0.002c0.335 0 0.664 0.024 0.985 0.070l-0.037-0.004c-0.008 0.119-0.036 0.232-0.036 0.354 0.006 2.987 2.429 5.406 5.417 5.406s5.411-2.419 5.416-5.406v-0.001c0-0.12-0.028-0.233-0.036-0.352 0.016-0.002 0.031 0.005 0.047 0.001 0.294-0.044 0.634-0.068 0.98-0.068 0.004 0 0.007 0 0.011 0h-0.001c3.379 0.013 6.203 2.371 6.93 5.531l0.009 0.048c0.076 0.34 0.375 0.589 0.732 0.59h0c0.057-0 0.112-0.007 0.165-0.019l-0.005 0.001c0.34-0.076 0.59-0.375 0.59-0.733 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005zM16 18.916c-0 0-0 0-0.001 0-2.163 0-3.917-1.753-3.917-3.917s1.754-3.917 3.917-3.917c2.163 0 3.917 1.754 3.917 3.917 0 0 0 0 0 0.001v-0c-0.003 2.162-1.754 3.913-3.916 3.916h-0z' />
                                </svg>
                                <span>Manage Users</span>
                            </NavLink>
                        }
                        { user?.role === 'Agent' && data?.status === 'active' &&
                            <NavLink to='/transactions' className='flex items-center space-x-2 p-3 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out' style={ ({ isActive }) => (isActive ? activeLinkStyle : {}) }>
                                <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                    <g> <g stroke='none'> <g transform='translate(-1248.000000, 0.000000)'> <g transform='translate(1248.000000, 0.000000)'> <path d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z'> </path> <path d='M14.0352,2.80881 C14.4041,2.54328 14.9244,2.41911 15.4361,2.60633 C16.5334,3.00779 17.5399,3.59556 18.4176,4.33073 C18.8347,4.6801 18.9873,5.19202 18.942,5.64392 C18.8666,6.39677 18.9994,7.12366 19.3611,7.7502 C19.6827889,8.30737333 20.1637667,8.74748988 20.7513584,9.05690332 L20.9766,9.16678 C21.3914,9.35374 21.7593,9.74288 21.8525,10.2803 C21.9495,10.8397 22,11.4144 22,12.0001 C22,12.5858 21.9495,13.1606 21.8525,13.72 C21.76862,14.20366 21.462233,14.567197 21.0994052,14.7713908 L20.9766,14.8335 C20.2865,15.1446 19.723,15.6233 19.3611,16.2501 C18.9994,16.8766 18.8666,17.6034 18.942,18.3562 C18.9872,18.8081 18.8347,19.32 18.4176,19.6694 C17.5399,20.4045 16.5334,20.9923 15.4362,21.3937 C14.9245,21.581 14.4042,21.4568 14.0353,21.1912 C13.4206,20.7488 12.7241,20.5 12,20.5 C11.2759,20.5 10.5794,20.7488 9.96474,21.1912 C9.59585,21.4568 9.07552,21.581 8.56378,21.3937 C7.46655,20.9923 6.46002,20.4045 5.5823,19.6693 C5.16523,19.32 5.01269,18.8081 5.05794,18.3562 C5.13332,17.6034 5.00045,16.8766 4.63874,16.2501 C4.31706,15.6929444 3.83615432,15.2528062 3.24858549,14.9433807 L3.02335,14.8335 C2.6086,14.6465 2.24075,14.2574 2.14752,13.72 C2.05047,13.1606 2,12.5858 2,12.0001 C2,11.4143 2.05047,10.8396 2.14751,10.2801 C2.231417,9.796467 2.5377662,9.4329165 2.90054972,9.2287416 L3.02334,9.16664 C3.71344,8.85555 4.27685,8.37689 4.63874,7.75007 C5.00046,7.12356 5.13333,6.39671 5.05794,5.64391 C5.01268,5.19203 5.16522,4.68015 5.5823,4.3308 C6.46004,3.59559 7.4666,3.0078 8.56387,2.60633 C9.07558,2.4191 9.59589,2.54328 9.96478,2.80881 C10.5794,3.25123 11.2759,3.50003 12,3.50003 C12.7241,3.50003 13.4206,3.25123 14.0352,2.80881 Z M14.9917,4.57792 C14.1261,5.14715 13.1053,5.50003 12,5.50003 C10.8947,5.50003 9.87388,5.14715 9.00832,4.57792 C8.30727,4.8608 7.65502,5.24042 7.0682,5.70056 C7.12793,6.734 6.92299,7.79365 6.37079,8.75007 C5.81845,9.70677 5.00295,10.4142 4.07778,10.8792 C4.02655,11.245 4,11.6192 4,12.0001 C4,12.381 4.02655,12.7551 4.07778,13.121 C5.00295,13.586 5.81845,14.2934 6.37079,15.2501 C6.92298,16.2065 7.12793,17.2661 7.0682,18.2995 C7.655,18.7597 8.30722,19.1393 9.00824,19.4222 C9.87381,18.8529 10.8947,18.5 12,18.5 C13.1053,18.5 14.1262,18.8529 14.9918,19.4222 C15.6927,19.1393 16.3449,18.7597 16.9317,18.2996 C16.872,17.2662 17.0769,16.2065 17.6291,15.2501 C18.1815,14.2933 18.997,13.5859 19.9222,13.1209 C19.9735,12.7551 20,12.381 20,12.0001 C20,11.6192 19.9735,11.2451 19.9222,10.8794 C18.997,10.4144 18.1815,9.70693 17.6291,8.7502 C17.0769,7.79371 16.8719,6.734 16.9317,5.7005 C16.3449,5.24039 15.6927,4.86079 14.9917,4.57792 Z M12,8 C14.2091,8 16,9.79086 16,12 C16,14.2091 14.2091,16 12,16 C9.79086,16 8,14.2091 8,12 C8,9.79086 9.79086,8 12,8 Z M12,10 C10.8954,10 10,10.8954 10,12 C10,13.1046 10.8954,14 12,14 C13.1046,14 14,13.1046 14,12 C14,10.8954 13.1046,10 12,10 Z' fill='currentColor'> </path> </g> </g> </g> </g>
                                </svg>
                                <p className='relative'>Requests{ totalCount > 0 ? <>
                                    <span className='flex absolute top-0 end-0 -mt-2 -me-4'>
                                        <span className='animate-ping absolute inline-flex size-full rounded-full bg-red-400 opacity-75'></span>
                                        <span className='relative inline-flex text-xs bg-red-500 text-white rounded-full py-[0.5px] px-[6px]'>
                                            { totalCount > 9 ? '9+' : totalCount }</span></span></> : '' }
                                </p>
                            </NavLink>
                        }
                        { data?.status === 'active' &&
                            <NavLink to='/send-money' className='flex items-center space-x-2 p-3 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out' style={ ({ isActive }) => (isActive ? activeLinkStyle : {}) }>
                                <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='-0.5 0 25 25' stroke='currentColor' strokeWidth='2'>
                                    <path d='M18 10.9199V2.91992' />
                                    <path d='M14.8008 6.11992L18.0008 2.91992L21.2008 6.11992' />
                                    <path d='M10.58 3.96997H6C4.93913 3.96997 3.92178 4.39146 3.17163 5.1416C2.42149 5.89175 2 6.9091 2 7.96997V17.97C2 19.0308 2.42149 20.0482 3.17163 20.7983C3.92178 21.5485 4.93913 21.97 6 21.97H18C19.0609 21.97 20.0783 21.5485 20.8284 20.7983C21.5786 20.0482 22 19.0308 22 17.97V13.8999' />
                                    <path d='M2 9.96997H5.37006C6.16571 9.96997 6.92872 10.286 7.49133 10.8486C8.05394 11.4112 8.37006 12.1743 8.37006 12.97C8.37006 13.7656 8.05394 14.5287 7.49133 15.0913C6.92872 15.6539 6.16571 15.97 5.37006 15.97H2' />
                                </svg>
                                <span>Send Money</span>
                            </NavLink>
                        }
                        { data?.status === 'active' &&
                            <NavLink to='/cash-in' className='flex items-center space-x-2 p-3 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out' style={ ({ isActive }) => (isActive ? activeLinkStyle : {}) }>
                                <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path d='M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24' /> <path d='M12 7.5V16.5' /> <path d='M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2' /> <path d='M17 3V7H21' /> <path d='M22 2L17 7' />
                                </svg>
                                <span>Cash In</span>
                            </NavLink>
                        }
                        { data?.status === 'active' &&
                            <NavLink to='/cash-out' className='flex items-center space-x-2 p-3 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out' style={ ({ isActive }) => (isActive ? activeLinkStyle : {}) }>
                                <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path d='M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24' /> <path d='M12 7.5V16.5' /> <path d='M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2' /> <path d='M22 6V2H18' /> <path d='M17 7L22 2' />
                                </svg>
                                <span>Cash Out</span>
                            </NavLink>
                        }
                        { data?.status === 'active' &&
                            <NavLink to='/statements' className='flex items-center space-x-2 p-3 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out' style={ ({ isActive }) => (isActive ? activeLinkStyle : {}) }>
                                <svg className='w-6 h-6' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 512 512'>
                                    <path d='M104 496H72a24 24 0 01-24-24V328a24 24 0 0124-24h32a24 24 0 0124 24v144a24 24 0 01-24 24zM328 496h-32a24 24 0 01-24-24V232a24 24 0 0124-24h32a24 24 0 0124 24v240a24 24 0 01-24 24zM440 496h-32a24 24 0 01-24-24V120a24 24 0 0124-24h32a24 24 0 0124 24v352a24 24 0 01-24 24zM216 496h-32a24 24 0 01-24-24V40a24 24 0 0124-24h32a24 24 0 0124 24v432a24 24 0 01-24 24z' />
                                </svg>
                                <span>Statement</span>
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
            </div >
            <main className='flex flex-col items-center justify-center flex-1'>
                <button onClick={ () => setIsSidebarOpen(true) } className='fixed p-2 text-white bg-blue-600 rounded-lg top-5 left-5'>
                    <svg className='w-6 h-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
                    </svg>
                    <span className='sr-only'>Open menu</span>
                </button>
                <Outlet />
            </main>
        </div >
    );
};

export default Sidebar;