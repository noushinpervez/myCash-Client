const Loading = () => {
    return (
        <div className='inset-0 bg-background-50 fixed flex space-x-2 justify-center items-center bg-gray-100 h-screen duration-300 transition-opacity'>
            <span className='sr-only'>Loading...</span>
            <div className='h-6 w-6 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-6 w-6 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-6 w-6 bg-blue-600 rounded-full animate-bounce'></div>
        </div>
    );
};

export default Loading;