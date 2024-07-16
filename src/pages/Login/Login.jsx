import { Link, useLocation, useNavigate } from 'react-router-dom'
import Toast from '../../components/Toast'
import useAxiosPublic from '../../hooks/useAxiosPublic'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query';

const Login = () => {
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        identifier: '',
        pin: ''
    });

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await axiosPublic.post('/login', formData, { withCredentials: true });
            return response.data;
        },
        onSuccess: (data) => {
            Toast.fire({
                icon: 'success',
                title: data?.message
            });
            navigate(location?.state ? location?.state : '/');
        },
        onError: (error) => {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || 'An error occurred. Please try again.'
            });
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
            <div className='flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md'>
                <div className='font-medium self-center text-xl sm:text-2xl uppercase text-gray-800'>Login To Your Account</div>
                <div className='mt-10'>
                    <form action='submit' onSubmit={ handleSubmit }>
                        <div className='flex flex-col mb-6'>
                            <label htmlFor='identifier' className='mb-1 text-xs sm:text-sm tracking-wide text-gray-600'>Username</label>
                            <div className='relative'>
                                <div className='inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400'>
                                    <svg className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path d='M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471' stroke='currentColor' strokeWidth='2' strokeLinecap='round'></path> <circle cx='12' cy='8' r='4' stroke='currentColor' strokeWidth='2' strokeLinecap='round'></circle>
                                    </svg>
                                </div>
                                <input id='identifier' type='text' name='identifier' value={ formData.identifier } onChange={ handleChange } className='text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400' placeholder='Email or Mobile Number' required />
                            </div>
                        </div>
                        <div className='flex flex-col mb-6'>
                            <label htmlFor='password' className='mb-1 text-xs sm:text-sm tracking-wide text-gray-600'>Pin</label>
                            <div className='relative'>
                                <div className='inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400'>
                                    <span>
                                        <svg className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                        </svg>
                                    </span>
                                </div>
                                <input id='pin' type='password' name='pin' pattern='[0-9]{5}' maxLength='5' onInput={ (event) => {
                                    event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                } } value={ formData.pin } onChange={ handleChange } className='text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400' placeholder='*****' required />
                            </div>
                        </div>
                        <div className='flex w-full'>
                            <button type='submit' className='flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in'>
                                <span className='mr-2 uppercase'>Login</span>
                                <span>
                                    <svg className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path d='M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className='flex justify-center items-center mt-6'>
                    <Link to='/signup' className='inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center'>
                        <span>
                            <svg className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                                <path d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' />
                            </svg>
                        </span>
                        <span className='ml-2'>Not a member?</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;