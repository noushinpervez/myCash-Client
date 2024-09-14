import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className='grid min-h-screen place-content-center bg-gray-100 px-4'>
            <div className='text-center'>
                <p className='text-9xl font-black text-gray-300'>404</p>
                <p className='text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Uh-oh!</p>
                <p className='mt-4 text-gray-500'>We cannot find that page.</p>
                <Link
                    to='/'
                    className='mt-6 inline-block rounded bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-offset-2'
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;