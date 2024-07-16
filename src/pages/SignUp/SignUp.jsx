import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPublic from '../../hooks/useAxiosPublic'
import Toast from '../../components/Toast'

const SignUp = () => {
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        number: "",
        email: "",
        pin: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPublic.post("/users", formData);
            
            Toast.fire({
                icon: 'success',
                title: response?.data?.message
            });

            navigate('/login');
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || 'An error occurred. Please try again.'
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
                <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Create An Account</div>
                <div className="mt-10">
                    <form action="submit" onSubmit={ handleSubmit }>
                        <div className="flex flex-col mb-6">
                            <label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Username</label>
                            <div className="relative">
                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path> <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></circle>
                                    </svg>
                                </div>
                                <input id="name" type="text" name="name" maxLength="30" pattern="^[^0-9]*$" onInput={ (event) => {
                                    event.target.value = event.target.value.replace(/\d/g, '');
                                } } value={ formData.name }  onChange={ handleChange }  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="First Last" required />
                            </div>
                        </div>
                        <div className="flex flex-col mb-6">
                            <label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Mobile Number</label>
                            <div className="relative">
                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 48 48" stroke="currentColor">
                                        <path id="Combined Shape" fillRule="evenodd" clipRule="evenodd" d="M36.0248 7C36.0248 5.34318 34.6826 4 33.0248 4H14.9988C13.344 4 11.9988 5.34425 11.9988 7V41C11.9988 42.6558 13.344 44 14.9988 44H33.0248C34.6826 44 36.0248 42.6568 36.0248 41V37.0828C36.0252 37.0712 36.0254 37.0595 36.0254 37.0478C36.0254 37.0361 36.0252 37.0244 36.0248 37.0128V7ZM34.0248 36.0478V7C34.0248 6.44744 33.5777 6 33.0248 6H14.9988C14.4482 6 13.9988 6.44913 13.9988 7V10.0478H31.0254C31.5777 10.0478 32.0254 10.4955 32.0254 11.0478C32.0254 11.6001 31.5777 12.0478 31.0254 12.0478H13.9988V41C13.9988 41.5509 14.4482 42 14.9988 42H33.0248C33.5777 42 34.0248 41.5526 34.0248 41V38.0478H16.9994C16.4471 38.0478 15.9994 37.6001 15.9994 37.0478C15.9994 36.4955 16.4471 36.0478 16.9994 36.0478H34.0248Z" fill="currentColor" />
                                    </svg>
                                </div>
                                <input id="number" type="text" name="number" pattern="01[0-9]{9}" maxLength="11" onInput={ (event) => {
                                    event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                    if (!/^01[0-9]{0,9}$/.test(event.target.value)) {
                                        event.target.setCustomValidity('The mobile number must start with 01 and be exactly 11 digits long.');
                                    } else {
                                        event.target.setCustomValidity('');
                                    }
                                } } value={ formData.number } onChange={ handleChange } className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="01971000000" required />
                            </div>
                        </div>
                        <div className="flex flex-col mb-6">
                            <label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Email Address</label>
                            <div className="relative">
                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input id="email" type="email" name="email" onInput={ (event) => {
                                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                    const input = event.target;
                                    if (!emailPattern.test(input.value)) {
                                        input.setCustomValidity("Please enter a valid email address.");
                                    } else {
                                        input.setCustomValidity("");
                                    }
                                } } value={ formData.email } onChange={ handleChange } className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="user@gmail.com" required />
                            </div>
                        </div>
                        <div className="flex flex-col mb-6">
                            <label htmlFor="password" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Pin</label>
                            <div className="relative">
                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                    <span>
                                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                </div>
                                <input id="pin" type="password" name="pin" pattern="[0-9]{5}" maxLength="5" onInput={ (event) => {
                                    event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                } } value={ formData.pin } onChange={ handleChange } className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="*****" required />
                            </div>
                        </div>
                        <div className="flex w-full">
                            <button type="submit" className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in">
                                <span className="mr-2 uppercase">Sign Up</span>
                                <span>
                                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex justify-center items-center mt-6">
                    <Link to="/login" className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center">
                        <span>
                            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </span>
                        <span className="ml-2">Already have an account?</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;