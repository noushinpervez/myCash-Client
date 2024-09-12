import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loading from '../../../../components/Loading';
import Toast from '../../../../components/Toast';
import ErrorToast from '../../../../components/ErrorToast';
import { useQuery } from '@tanstack/react-query';

const fetchUsers = async (axiosSecure, page, search) => {
    const response = await axiosSecure.get('/users', {
        params: { page, search },
        withCredentials: true,
    });
    return response.data;
};

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: usersData = {}, isLoading, isError, error: queryError } = useQuery({
        queryKey: ['users', currentPage, searchTerm],
        queryFn: () => fetchUsers(axiosSecure, currentPage, searchTerm),
        enabled: true,
    });
    const { users: fetchedUsers = [], totalCount = 0, totalPages = 0 } = usersData;

    useEffect(() => {
        if (fetchedUsers.length) {
            setUsers(fetchedUsers);
            setFilteredUsers(fetchedUsers);
        }
        setLoading(isLoading);
        setError(isError ? queryError : null);
    }, [fetchedUsers, isLoading, isError, queryError]);

    useEffect(() => {
        const results = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value === '') {
            setSearchTerm('');
            setCurrentPage(1);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(search);
        setCurrentPage(1);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await axiosSecure.patch(`/users/${id}`, { status: newStatus }, {
                withCredentials: true,
            });
            if (response.data.modifiedCount > 0) {
                const updatedUsers = users.map(user =>
                    user._id === id ? { ...user, status: newStatus, balance: response.data.balance || user.balance } : user
                );

                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers.filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                ));

                if (newStatus === 'active') {
                    Toast.fire({
                        icon: 'success',
                        title: 'User activated successfully'
                    });
                } else {
                    ErrorToast.fire({
                        icon: 'error',
                        title: 'User blocked successfully'
                    });
                }
            }
        } catch (error) {
            ErrorToast.fire({
                icon: 'error',
                title: 'Error updating user status'
            });
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className='text-red-500 text-center text-xl font-semibold min-h-screen flex items-center'>
                { error.message || 'An error occurred' }
            </div>
        );
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className='min-h-screen flex flex-col md:items-center justify-center bg-gray-100 w-full px-4'>
            <div className='font-medium self-center text-xl sm:text-2xl uppercase text-gray-800'>Manage Users</div>
            <div className='w-full max-w-lg my-8'>
                <form className='sm:flex sm:items-center' onSubmit={ handleSearchSubmit }>
                    <input
                        id='search'
                        name='search'
                        className='inline w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm'
                        placeholder='Search by name or email'
                        type='search'
                        autoFocus=''
                        value={ search }
                        onChange={ handleSearchChange }
                    />
                    <button
                        type='submit'
                        className='mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    >
                        Search
                    </button>
                </form>
            </div>
            { filteredUsers.length === 0 ? (
                <div className='text-center text-gray-500 font-medium my-8'>No users found</div>
            ) : (
                <div className='overflow-scroll overflow-y-hidden rounded-md'>
                    <table className='divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Name
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Mobile Number
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Role
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            { filteredUsers.map(user => (
                                <tr key={ user._id }>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center'>
                                            <div>
                                                <div className='text-sm font-medium text-gray-900 text-ellipsis overflow-hidden w-26'>
                                                    { user.name }
                                                </div>
                                                <div className='text-sm text-gray-500 text-ellipsis overflow-hidden w-24'>
                                                    { user.email }
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-500'>{ user.number }</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className={ `px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300 ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}` }>
                                            { user.status }
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        { user?.role }
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <div className='flex justify-start items-start gap-2'>
                                            <button
                                                className={ `${user?.status === 'active' ? 'hidden' : 'block text-blue-600 hover:text-blue-800 border-blue-400 rounded-full px-1.5 py-0.5 border'}` }
                                                onClick={ () => handleStatusChange(user._id, 'active') }
                                            >
                                                Active
                                            </button>
                                            <button
                                                className={ `${user?.status === 'active' || user?.status === 'pending' ? 'text-red-600 hover:text-red-500 py-0.5 px-1.5 rounded-full border border-red-400 block' : 'hidden'}` }
                                                onClick={ () => handleStatusChange(user._id, 'blocked') }
                                            >
                                                Block
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                    {/* Pagination */ }
                    { totalPages <= 1 ? '' : (
                        <>
                            <div className='flex justify-center mt-8 text-sm text-gray-500 font-medium'>
                                Showing { users.length } of { totalCount } users
                            </div>
                            <ol className='mt-4 flex justify-center gap-1 text-xs font-medium'>
                                <li>
                                    <button
                                        onClick={ () => handlePageChange(currentPage - 1) }
                                        disabled={ currentPage === 1 }
                                        className='inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'
                                    >
                                        <span className='sr-only'>Prev Page</span>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='size-3'
                                            viewBox='0 0 20 20'
                                            fill='currentColor'
                                        >
                                            <path
                                                fillRule='evenodd'
                                                d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                    </button>
                                </li>
                                { [...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={ index }
                                        onClick={ () => handlePageChange(index + 1) }
                                        className={ `block rounded-md border size-8 text-center leading-8 ${currentPage === index + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border border-gray-100 bg-white text-gray-900'}` }
                                    >
                                        { index + 1 }
                                    </button>
                                )) }
                                <li>
                                    <button
                                        onClick={ () => handlePageChange(currentPage + 1) }
                                        disabled={ currentPage === totalPages }
                                        className='inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'
                                    >
                                        <span className='sr-only'>Next Page</span>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='size-3'
                                            viewBox='0 0 20 20'
                                            fill='currentColor'
                                        >
                                            <path
                                                fillRule='evenodd'
                                                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                    </button>
                                </li>
                            </ol>
                        </>
                    ) }
                </div>
            ) }
        </div>
    );
};

export default ManageUsers;