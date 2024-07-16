import useUserData from '../../../hooks/useUserData'

const Profile = () => {
    const { data, error, isLoading } = useUserData();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: { error.message }</div>;

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
            <div className='group relative flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md overflow-hidden ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-lg'>
                <div className='mt-10'>
                    <span className="absolute top-25 z-0 h-20 w-20 rounded-full bg-sky-600 transition-all duration-300 group-hover:scale-[10]"></span>
                    <div className="relative z-10 mx-auto max-w-md">
                        <span className="grid h-20 w-20 place-items-center rounded-full bg-sky-600 transition-all duration-300 group-hover:bg-sky-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-white transition-all">
                                <path d="M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path> <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></circle>
                            </svg>
                        </span>
                        <div
                            className="pt-5 transition-all duration-300 group-hover:text-white/90 font-medium self-center text-xl sm:text-2xl text-gray-800">
                            <p className='uppercase'>{ data?.name }</p>
                            <p className='mt-2 text-xl text-gray-600 group-hover:text-white/70'>{ data?.email }</p>
                            <p className='mt-1 text-xl text-gray-600 group-hover:text-white/70'>MyCash Number: { data.number }</p>
                        </div>
                        <div className="pt-5 text-base font-semibold leading-7">
                            <p className="text-sky-500 transition-all duration-300 group-hover:text-white">Transactions
                                &rarr;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;