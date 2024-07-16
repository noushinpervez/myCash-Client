import { useQuery } from '@tanstack/react-query';
import useUserData from '../../../hooks/useUserData'
import useAxiosPublic from '../../../hooks/useAxiosPublic';

const Profile = () => {
    const user = useUserData();
    const axiosPublic = useAxiosPublic();

    const { data: userData } = useQuery({
        queryKey: ['user', user?.id],
        queryFn: async () => {
            const response = await axiosPublic.get(`/users/${user?.id}`, {
                withCredentials: true,
            });

            return response.data;
        },
        enabled: !!user?.id,
    });

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 w-full px-4'>
            <div className='group relative flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md overflow-hidden ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
                <div className='mt-10'>
                    <span className="absolute top-25 z-0 h-20 w-20 rounded-full bg-blue-500 transition-all duration-300 group-hover:scale-[11]"></span>
                    <div className="relative z-10 mx-auto max-w-md">
                        <span className="grid h-20 w-20 place-items-center rounded-full bg-blue-500 transition-all duration-300 group-hover:bg-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-white transition-all">
                                <path d="M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path> <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></circle>
                            </svg>
                        </span>
                        <div
                            className="pt-5 transition-all duration-300 group-hover:text-white/90 font-medium self-center text-xl sm:text-2xl text-gray-800">
                            <p className='uppercase'>{ userData?.name }</p>
                            <p className='mt-2 text-xl text-gray-600 group-hover:text-white/70'>{ userData?.email }</p>
                            <p className='mt-2 text-xl text-gray-600 group-hover:text-white/70'>{ userData?.number }</p>
                        </div>
                        <div className="pt-5 text-base font-semibold leading-7 flex items-center gap-2 text-sky-500 transition-all duration-300 group-hover:text-white">
                            <svg fill="currentColor" width="64px" height="64px" viewBox="0 0 64 64" className='w-6 h-6'>
                                <path d="M22,23.487a5.24,5.24,0,0,1,5.21,3.973H24.773a1,1,0,0,0,0,2h2.542v6.711a7.843,7.843,0,0,0,15.685,0,1,1,0,0,0-1-1H37.789a1,1,0,0,0,0,2h3.125a5.843,5.843,0,0,1-11.6-1V29.459h2.676a1,1,0,0,0,0-2H29.235A7.206,7.206,0,0,0,22,21.487a1,1,0,0,0,0,2Z" /> <path d="M32,2A30,30,0,1,0,62,32,30.034,30.034,0,0,0,32,2Zm0,58A28,28,0,1,1,60,32,28.032,28.032,0,0,1,32,60Z" /> <path d="M49.655,16.793A3.183,3.183,0,1,0,47.746,19.7,19.994,19.994,0,0,1,22.691,49.707a1,1,0,0,0-.931,1.77A21.986,21.986,0,0,0,49.229,18.352,3.133,3.133,0,0,0,49.655,16.793Zm-4.344,0a1.172,1.172,0,1,1,1.171,1.173A1.172,1.172,0,0,1,45.311,16.793Z" /> <path d="M16.793,44.034a3.157,3.157,0,0,0-.692.081A19.78,19.78,0,0,1,12,32,20.023,20.023,0,0,1,32,12a19.811,19.811,0,0,1,8.463,1.874,1,1,0,0,0,.848-1.812A21.8,21.8,0,0,0,32,10,22.025,22.025,0,0,0,10,32a21.756,21.756,0,0,0,4.389,13.16,3.159,3.159,0,1,0,2.4-1.126Zm0,4.345a1.173,1.173,0,1,1,1.173-1.172A1.172,1.172,0,0,1,16.793,48.379Z" />
                            </svg>
                            <p>Balance { userData?.balance }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;