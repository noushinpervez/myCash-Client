import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading';
import { useUserData } from '../../../Provider/UserProvider';
import useUserDataQuery from '../../../hooks/useUserDataQuery';
import { useState } from 'react';
import Pagination from '../../../components/Pagination';
import getTransactionDetails from '../../../utils/logic';

const fetchTransactions = async (axiosSecure, email, number, page) => {
    const response = await axiosSecure.get('/transactions', {
        params: { email, number, page },
        withCredentials: true,
    });
    return response.data;
};

const TransactionHistory = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading: userLoading } = useUserData();
    const { data: userData, isLoading: userDataLoading } = useUserDataQuery(user?.id);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: transactionsData = {}, isLoading, error } = useQuery({
        queryKey: ['transactions', userData?.email, userData?.number, currentPage],
        queryFn: () => fetchTransactions(axiosSecure, userData?.email, userData?.number, currentPage),
        enabled: !!userData?.email,
    });
    const { transactions = [], totalCount = 0, transactionLimit = 0, totalPages = 0 } = transactionsData;

    if (isLoading || userLoading || userDataLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className='text-red-500 text-center text-xl font-semibold min-h-screen flex items-center'>
                { error.response?.data?.message || 'Failed to fetch transactions' }
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
            <h1 className='self-center text-3xl text-blue-600 font-bold'>Statement</h1>
            <div className='overflow-scroll overflow-y-hidden my-8 rounded-md'>
                { transactions?.length === 0 ? (
                    <div className='text-center text-gray-500 font-medium my-8'>
                        No transactions found at the moment.
                    </div>
                ) : (
                    <>
                        <table className='divide-y divide-gray-200'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
                                        Service
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
                                        From/To
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
                                        Amount
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
                                        DateTime
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                { transactions.map(transaction => {
                                    const { sign, colorClass, isRecipient, statusMsg, charge } = getTransactionDetails(userData, user, transaction);
                                    return (
                                        <tr key={ transaction?._id }>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='sm:text-sm text-gray-900 font-medium'>
                                                    { transaction?.category }
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='sm:text-sm text-gray-900 font-medium'>
                                                    { user?.role === 'Admin'
                                                        ? `${transaction?.email} / ${transaction?.recipient}`
                                                        : (isRecipient
                                                            ? transaction?.email
                                                            : transaction?.recipient) }
                                                </div>
                                                <div className='mt-1 text-sm sm:text-xs capitalize text-gray-500'>
                                                    { statusMsg }
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className={ `sm:text-sm ${colorClass} font-medium` }>
                                                    { sign } BDT { transaction?.amount }
                                                </div>
                                                <div className='mt-1 text-sm sm:text-xs text-gray-500'>
                                                    { charge }
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm sm:text-xs text-gray-500'>
                                                <div>{ new Date(transaction?.timestamp).toLocaleTimeString() }</div>
                                                <div>{ new Date(transaction?.timestamp).toLocaleDateString() }</div>
                                            </td>
                                        </tr>
                                    );
                                }) }
                            </tbody>
                        </table>
                    </>
                ) }
            </div>
            <Pagination
                length={ transactions.length }
                totalCount={ Math.min(transactionLimit, totalCount) }
                currentPage={ currentPage }
                totalPages={ totalPages }
                onPageChange={ handlePageChange }
                text='transaction history'
            />
        </div>
    );
};

export default TransactionHistory;