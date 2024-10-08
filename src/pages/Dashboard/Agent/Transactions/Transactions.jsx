import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loading from '../../../../components/Loading';
import { useUserData } from '../../../../Provider/UserProvider';
import useUserDataQuery from '../../../../hooks/useUserDataQuery';
import Toast from '../../../../components/Toast';
import ErrorToast from '../../../../components/ErrorToast';
import usePendingTransactions from '../../../../hooks/usePendingTransactions';
import Pagination from '../../../../components/Pagination';
import getTransactionDetails from '../../../../utils/logic';

const handleTransaction = async (axiosSecure, transactionId, action) => {
    await axiosSecure.post('/handle-transaction', {
        transactionId,
        action,
    }, { withCredentials: true });
};

const TransactionManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const axiosSecure = useAxiosSecure();
    const { user, loading: userLoading } = useUserData();
    const { data: userData, isLoading: userDataLoading } = useUserDataQuery(user?.id);
    const [loadingTransaction, setLoadingTransaction] = useState(null);
    const { data: transactionsData = {}, isLoading, error, refetch } = usePendingTransactions(userData?.email, userData?.number, currentPage);
    const { transactions = [], totalCount = 0, totalPages = 0 } = transactionsData;

    console.log(userData?.number);


    const mutation = useMutation({
        mutationFn: ({ transactionId, action }) => handleTransaction(axiosSecure, transactionId, action),
        onSuccess: (data, variables) => {
            if (variables.action === 'approve') {
                Toast.fire({
                    icon: 'success',
                    title: `Transaction ${variables.action}d successfully!`,
                });
            } else if (variables.action === 'reject') {
                ErrorToast.fire({
                    icon: 'error',
                    title: `Transaction ${variables.action}ed successfully!`,
                });
            }
            refetch();
            setLoadingTransaction(null);
        },
        onError: (err) => {
            ErrorToast.fire({
                icon: 'error',
                title: err.response?.data?.message || 'Failed to process transaction',
            });
            setLoadingTransaction(null);
        },
    });

    const handleAction = async (transactionId, action) => {
        setLoadingTransaction(transactionId);
        await mutation.mutateAsync({ transactionId, action });

        const { data: updatedData } = await refetch();
        const { transactions } = updatedData;

        // Check if the current page is empty and adjust if necessary
        if (transactions.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        setLoadingTransaction(null);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (isLoading || userLoading || userDataLoading || loadingTransaction) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className='text-red-500 text-center text-xl font-semibold min-h-screen flex items-center'>
                { error.response?.data?.message || 'Failed to fetch pending transactions' }
            </div>
        );
    }

    return (
        <div className='min-h-screen flex flex-col md:items-center justify-center bg-gray-100 w-full px-4'>
            <h1 className='self-center text-3xl text-blue-600 font-bold'>Transaction Management</h1>
            <div className='overflow-scroll overflow-y-hidden rounded-md my-8'>
                { transactions.length === 0 ? (
                    <div className='text-center text-gray-500 font-medium my-8'>
                        No pending transactions found at the moment.
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
                                    <th scope='col' className='px-6 py-3 text-left text-sm sm:text-xs font-semibold sm:font-medium text-gray-500 uppercase tracking-wider'>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                { transactions.map(transaction => {
                                    const { sign, colorClass, isRecipient, statusMsg, charge } = getTransactionDetails(userData, user, transaction);
                                    return (
                                        <tr key={ transaction._id }>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='sm:text-sm text-gray-900 font-medium'>
                                                    { transaction.category }
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='sm:text-sm text-gray-900 font-medium'>
                                                    { isRecipient ? transaction.email : transaction.recipient }
                                                </div>
                                                <div className='mt-1 text-sm sm:text-xs text-gray-500 capitalize'>
                                                    { statusMsg }
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className={ `sm:text-sm ${colorClass} font-medium` }>
                                                    { sign } BDT { transaction.amount }
                                                </div>
                                                <div className='mt-1 text-sm sm:text-xs text-gray-500'>
                                                    { charge }
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm sm:text-xs text-gray-500'>
                                                <div>{ new Date(transaction.timestamp).toLocaleTimeString() }</div>
                                                <div>{ new Date(transaction.timestamp).toLocaleDateString() }</div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <button
                                                    onClick={ () => handleAction(transaction._id, 'approve') }
                                                    className='mr-2'
                                                >
                                                    <svg className='w-8 h-8' viewBox='0 0 512 512' fill='#3b82f6'>
                                                        <path d='M256,43.5C138.64,43.5,43.5,138.64,43.5,256S138.64,468.5,256,468.5S468.5,373.36,468.5,256 S373.36,43.5,256,43.5z M378.81,222.92L249.88,351.86c-7.95,7.95-18.52,12.33-29.76,12.33s-21.81-4.38-29.76-12.33l-57.17-57.17 c-8.3-8.3-12.87-19.35-12.87-31.11s4.57-22.81,12.87-31.11c8.31-8.31,19.36-12.89,31.11-12.89s22.8,4.58,31.11,12.89l24.71,24.7 l96.47-96.47c8.31-8.31,19.36-12.89,31.11-12.89c11.75,0,22.8,4.58,31.11,12.89c8.3,8.3,12.87,19.35,12.87,31.11 S387.11,214.62,378.81,222.92z' />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={ () => handleAction(transaction._id, 'reject') }
                                                >
                                                    <svg className='w-8 h-8' viewBox='0 0 512 512' fill='#ef4444'>
                                                        <path d='M263.24,43.5c-117.36,0-212.5,95.14-212.5,212.5s95.14,212.5,212.5,212.5s212.5-95.14,212.5-212.5 S380.6,43.5,263.24,43.5z M367.83,298.36c17.18,17.18,17.18,45.04,0,62.23v0c-17.18,17.18-45.04,17.18-62.23,0l-42.36-42.36 l-42.36,42.36c-17.18,17.18-45.04,17.18-62.23,0v0c-17.18-17.18-17.18-45.04,0-62.23L201.01,256l-42.36-42.36 c-17.18-17.18-17.18-45.04,0-62.23v0c17.18-17.18,45.04-17.18,62.23,0l42.36,42.36l42.36-42.36c17.18-17.18,45.04-17.18,62.23,0v0 c17.18,17.18,17.18,45.04,0,62.23L325.46,256L367.83,298.36z' />
                                                    </svg>
                                                </button>
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
                totalCount={ totalCount }
                currentPage={ currentPage }
                totalPages={ totalPages }
                onPageChange={ handlePageChange }
                text='pending requests'
            />
        </div>
    );
};

export default TransactionManagement;