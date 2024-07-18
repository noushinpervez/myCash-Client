import { useEffect, useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import Loading from '../../../components/Loading'
import useUserData from '../../../hooks/useUserData'
import useUserDataQuery from '../../../hooks/useUserDataQuery'

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const axiosSecure = useAxiosSecure();
    const { user, loading: userLoading } = useUserData();
    const { data, isLoading } = useUserDataQuery(user?.id);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axiosSecure.get('/transactions',{
                    params: {
                    email: data.email 
                }, 
                    withCredentials: true,
                });
                setTransactions(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError('Access denied');
                }
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [axiosSecure, data?.email]);

    if (loading || isLoading || userLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className='text-red-500 text-center text-xl font-semibold min-h-screen flex items-center'>
                { error }
            </div>
        );
    }

    return (
        <div className='min-h-screen flex flex-col md:items-center justify-center bg-gray-100 w-full px-4'>
            <div className='font-medium self-center text-xl sm:text-2xl uppercase text-gray-800'>Statements</div>
            <div className='overflow-scroll rounded-md my-8'>
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
                                    <div className='text-sm text-gray-900 font-medium'>{ transaction.recipient === data.email ? transaction.email : transaction.recipient }</div>
                                    <div className='mt-1 text-xs text-gray-500'>{ transaction.recipient === data.email ? 'Received' : 'Sent' }</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className={ `text-sm ${transaction.recipient === data.email ? 'text-blue-500' : 'text-red-500'} font-medium` }>{ transaction.recipient === data.email ? '+' : '-' } BDT { transaction.amount }</div>
                                    <div className='mt-1 text-xs text-gray-500'>{ transaction.fee > 0 && transaction.email === data.email ? `Charge BDT ${transaction.fee}` : 'No Charge' }</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    <div>
                                        { new Date(transaction.timestamp).toLocaleTimeString() }
                                    </div>
                                    <div>
                                        { new Date(transaction.timestamp).toLocaleDateString() }
                                    </div>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;