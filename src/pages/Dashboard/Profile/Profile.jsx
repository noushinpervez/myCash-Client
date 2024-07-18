import useUserData from '../../../hooks/useUserData'
import Loading from '../../../components/Loading'
import useUserDataQuery from '../../../hooks/useUserDataQuery'

const Profile = () => {
    const { user, loading } = useUserData();
    const { data, isLoading } = useUserDataQuery(user?.id);

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 w-full px-4'>
            <div className='group relative flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md overflow-hidden ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
                <div className='mt-10'>
                    <span className='absolute top-25 z-0 h-20 w-20 rounded-full bg-blue-500 transition-all duration-300 group-hover:scale-[11.5]'></span>
                    <div className='relative z-10 mx-auto max-w-md'>
                        <div className='text-right -mt-12'>
                            <p className='text-blue-900 font-medium'>{ data?.role }</p>
                            <p className={ `mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full italic ${data?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}` }>{ data?.status }</p>
                        </div>
                        <span className='grid h-20 w-20 place-items-center rounded-full bg-blue-500 transition-all duration-300 group-hover:bg-blue-700'>
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='h-10 w-10 text-white transition-all'>
                                <path d='M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471' stroke='currentColor' strokeWidth='2' strokeLinecap='round'></path> <circle cx='12' cy='8' r='4' stroke='currentColor' strokeWidth='2' strokeLinecap='round'></circle>
                            </svg>
                        </span>
                        <div
                            className='mt-5 transition-all duration-300 group-hover:text-white/90 font-medium self-center text-xl lg:text-2xl text-gray-800'>
                            <p className='uppercase text-ellipsis overflow-hidden'>{ data?.name }</p>
                            <p className='text-lg text-gray-500 group-hover:text-white/70 text-ellipsis overflow-hidden'>{ data?.email }</p>
                            <p className='mt-2 text-lg text-gray-500 group-hover:text-white/70'>{ data?.number }</p>
                        </div>
                        <div className='mt-8 text-xl font-semibold leading-7 flex items-center gap-2 text-sky-500 transition-all duration-300 group-hover:text-blue-950'>
                            <svg fill='none' width='64px' height='64px' viewBox='0 0 24 24' className='w-6 h-6' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                                <path stroke='none' d='M0 0h24v24H0z' />
                                <path d='M17.5 15.5 A1 1 0 0 1 16.5 16.5 A1 1 0 0 1 15.5 15.5 A1 1 0 0 1 17.5 15.5 z' />
                                <path d='M7 7a2 2 0 114 0v9a3 3 0 006 0v-.5M8 11h6' />
                            </svg>
                            <p>{ data?.balance }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;