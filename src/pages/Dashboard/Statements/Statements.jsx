import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading';
import useUserData from '../../../hooks/useUserData';
import useUserDataQuery from '../../../hooks/useUserDataQuery';
import { useState } from 'react';

const fetchTransactions = async (axiosSecure, email, page) => {
    const response = await axiosSecure.get('/transactions', {
        params: { email, page },
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
        queryKey: ['transactions', userData?.email, currentPage],
        queryFn: () => fetchTransactions(axiosSecure, userData?.email, currentPage),
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
            <div className='font-medium self-center text-xl sm:text-2xl uppercase text-gray-800'>Statement</div>
            <div className='overflow-scroll overflow-y-hidden my-8 rounded-md'>
                { transactions.length === 0 ? (
                    <div className='text-center text-gray-500 font-medium my-8'>
                        No transactions found at the moment.
                    </div>
                ) : (
                    <>
                        <table className='divide-y divide-gray-200'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Service
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        From/To
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Amount
                                    </th>
                                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        DateTime
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                { transactions.map(transaction => (
                                    <tr key={ transaction._id }>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900 font-medium'>
                                                { transaction.category }
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900 font-medium'>
                                                { user?.role === 'Admin'
                                                    ? `${transaction.email} / ${transaction.recipient}`
                                                    : (transaction.recipient === userData.email
                                                        ? transaction.email
                                                        : transaction.recipient) }
                                            </div>
                                            <div className='mt-1 text-xs text-gray-500'>
                                                { transaction.recipient === userData.email ? 'Received' : 'Sent' }
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className={ `text-sm ${(transaction.category === 'Cash In' && user.role !== 'Agent') ||
                                                (transaction.category === 'Cash Out' && transaction.email !== userData.email && user.role === 'Agent') ||
                                                (transaction.category === 'Send Money' && transaction.recipient === userData.email) ?
                                                'text-blue-500' : 'text-red-500'} font-medium` }>
                                                { (transaction.category === 'Cash In' && user.role !== 'Agent') ||
                                                    (transaction.category === 'Cash Out' && transaction.email !== userData.email && user.role === 'Agent') ||
                                                    (transaction.category === 'Send Money' && transaction.recipient === userData.email) ?
                                                    '+' :
                                                    '-'
                                                } BDT { transaction.amount }
                                            </div>
                                            <div className='mt-1 text-xs text-gray-500'>
                                                { transaction.fee > 0 && transaction.email === userData.email ? `Charge BDT ${transaction.fee}` : 'No Charge' }
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                            <div>{ new Date(transaction.timestamp).toLocaleTimeString() }</div>
                                            <div>{ new Date(transaction.timestamp).toLocaleDateString() }</div>
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                        {/* Pagination */ }
                        { totalPages <= 1 ? '' : (
                            <>
                                <div className='flex justify-center mt-8 text-sm text-gray-500 font-medium'>
                                    Showing { transactions.length } of { Math.min(transactionLimit, totalCount) } transactions
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
                    </>
                ) }
            </div>
        </div>
    );
};

export default TransactionHistory;