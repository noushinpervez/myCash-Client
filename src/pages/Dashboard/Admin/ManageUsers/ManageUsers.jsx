import { useEffect, useState } from 'react'
import useAxiosPublic from '../../../../hooks/useAxiosPublic'
import Loading from '../../../../components/Loading'
import Toast from '../../../../components/Toast'

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosPublic.get('/users', {
                    withCredentials: true,
                });
                setUsers(response.data);
                setFilteredUsers(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError('Access denied.');
                    setLoading(false);
                }
            }
        };
        fetchUsers();
    }, [axiosPublic]);

    useEffect(() => {
        const results = users.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(results);
    }, [search, users]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleStatusChange = async (id, newStatus) => {
        const response = await axiosPublic.patch(`/users/${id}`, { status: newStatus }, {
            withCredentials: true,
        });
        if (response.data.modifiedCount > 0) {
            const updatedUsers = users.map(user =>
                user._id === id ? { ...user, status: newStatus, balance: response.data.balance || user.balance } : user
            );

            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers.filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase())
            ));

            if (newStatus === 'active') {
                Toast.fire({
                    icon: 'success',
                    title: 'User activated successfully'
                });
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'User blocked successfully'
                });
            }
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className='text-red-500 text-center text-xl font-semibold'>
                { error }
            </div>
        );
    }

    return (
        <div className='min-h-screen overflow-hidden overflow-x-scroll flex flex-col items-center justify-center'>
            <div className='font-medium self-center text-xl sm:text-2xl uppercase text-gray-800'>Manage Users</div>
            <div className='w-full max-w-lg my-8'>
                <form className='sm:flex sm:items-center'>
                    <input id='search' name='search' className='inline w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm' placeholder='Search by name' type='search' autoFocus='' value={ search } onChange={ handleSearchChange } /><button type='submit' className='mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm' onClick={ (e) => e.preventDefault() }>Search</button>
                </form>
            </div>
            { filteredUsers.length === 0 ? (<div className='text-center text-gray-500'>No users found</div>) : (
                <table className='divide-y divide-gray-200 overflow-hidden overflow-x-scroll rounded-md'>
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
                                        <div className='ml-4'>
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
                                    { user.role }
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap  text-sm font-medium'>
                                    <button className='text-blue-600 hover:text-blue-800' onClick={ () => handleStatusChange(user._id, 'active') }>Active</button>
                                    <button className='ml-2 text-red-600 hover:text-red-500' onClick={ () => handleStatusChange(user._id, 'blocked') }>Block</button>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            ) }
        </div>
    );
};

export default ManageUsers;