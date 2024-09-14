import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loading from '../../../../components/Loading';
import Toast from '../../../../components/Toast';
import ErrorToast from '../../../../components/ErrorToast';
import { useQuery } from '@tanstack/react-query';
import Pagination from '../../../../components/Pagination';

const fetchUsers = async (axiosSecure, page, search, role, status) => {
    const response = await axiosSecure.get('/all-users', {
        params: { page, search, role, status },
        withCredentials: true,
    });
    return response.data;
};

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setRole] = useState('');
    const [selectedStatus, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: usersData = {}, isLoading, isError, error: queryError } = useQuery({
        queryKey: ['users', currentPage, searchTerm, selectedRole, selectedStatus],
        queryFn: () => fetchUsers(axiosSecure, currentPage, searchTerm, selectedRole, selectedStatus),
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

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusUpdate = async (id, newStatus) => {
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

    const handleClearFilters = () => {
        setSearch('');
        setSearchTerm('');
        setRole('');
        setStatus('');
        setCurrentPage(1);
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
        <div className='min-h-screen flex flex-col md:items-center justify-center bg-gray-100 w-full px-4 sm:my-0 my-16'>
            <h1 className='self-center text-3xl text-blue-600 font-bold'>Manage Users</h1>
            { filteredUsers.length === 0 ? (
                <div className='text-center text-gray-500 font-medium my-8'>No users found</div>
            ) : (
                <>
                    <div className='max-w-2xl w-full my-8 md:p-3'>
                        <form className='sm:flex sm:items-center space-y-2 sm:space-y-0' onSubmit={ handleSearchSubmit }>
                            <input
                                id='search'
                                name='search'
                                className='inline w-full rounded-md border border-gray-300 bg-white py-3 px-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm flex-grow'
                                placeholder='Search by name or email'
                                type='search'
                                autoFocus=''
                                value={ search }
                                onChange={ handleSearchChange }
                            />
                            <select
                                name='role'
                                id='role'
                                className='w-[49.1%] sm:w-fit rounded-md border border-gray-300 bg-white text-gray-700 sm:text-sm py-3 px-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:ml-1.5'
                                value={ selectedRole }
                                onChange={ handleRoleChange }
                            >
                                <option value=''>Filter by role</option>
                                <option value='Admin'>Admin</option>
                                <option value='Agent'>Agent</option>
                                <option value='User'>User</option>
                            </select>
                            <select
                                name='status'
                                id='status'
                                className='w-[49.1%] sm:w-fit rounded-md border border-gray-300 bg-white text-gray-700 sm:text-sm py-3 px-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ml-1.5'
                                value={ selectedStatus }
                                onChange={ handleStatusChange }
                            >
                                <option value=''>Filter by status</option>
                                <option value='active'>Active</option>
                                <option value='pending'>Pending</option>
                                <option value='blocked'>Blocked</option>
                            </select>
                            <button
                                type='submit'
                                className='inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                            >Search</button>
                        </form>
                        <div className='flex justify-end'>
                            <button
                                onClick={ handleClearFilters }
                                className='mt-2 inline-flex items-center justify-center rounded-md border border-transparent font-medium text-gray-500 hover:text-gray-800 italic sm:w-auto text-xs'
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                    <div className='overflow-scroll overflow-y-hidden rounded-md max-w-2xl mb-8'>
                        <table className='divide-y divide-gray-200'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
                                        Name
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
                                        Mobile Number
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
                                        Status
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
                                        Role
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
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
                                                    <div className='sm:text-sm font-medium text-gray-900 text-ellipsis overflow-hidden w-26'>
                                                        { user.name }
                                                    </div>
                                                    <div className='text-sm text-gray-500 text-ellipsis overflow-hidden w-24'>
                                                        { user.email }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='sm:text-sm text-gray-500'>{ user.number }</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={ `px-2 inline-flex text-sm sm:text-xs leading-5 font-semibold rounded-full transition-all duration-300 ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}` }>
                                                { user.status }
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap sm:text-sm text-gray-500'>
                                            { user?.role }
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap sm:text-sm font-medium'>
                                            <div className='flex justify-start items-start gap-2'>
                                                <button
                                                    className={ `${user?.status === 'active' ? 'hidden' : 'block text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600 rounded-full px-1.5 py-0.5 border'}` }
                                                    onClick={ () => handleStatusUpdate(user._id, 'active') }
                                                >
                                                    Active
                                                </button>
                                                <button
                                                    className={ `${user?.status === 'active' || user?.status === 'pending' ? 'text-red-600 hover:bg-red-500 hover:text-white py-0.5 px-1.5 rounded-full border border-red-600 block' : 'hidden'}` }
                                                    onClick={ () => handleStatusUpdate(user._id, 'blocked') }
                                                >
                                                    Block
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        length={ filteredUsers.length }
                        totalCount={ totalCount }
                        currentPage={ currentPage }
                        totalPages={ totalPages }
                        onPageChange={ handlePageChange }
                        text='users'
                    />
                </>
            ) }
        </div>
    );
};

export default ManageUsers;