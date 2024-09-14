import { useCallback, useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useUserData } from '../../../Provider/UserProvider';
import useUserDataQuery from '../../../hooks/useUserDataQuery';
import Loading from '../../../components/Loading';
import ErrorToast from '../../../components/ErrorToast';
import Toast from '../../../components/Toast';
import CashOutForm from './CashOutForm';
import CashOutModal from './CashOutModal';

const CashOut = () => {
    const [identifier, setIdentifier] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [message, setMessage] = useState('');
    const [msg, setMsg] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const axiosSecure = useAxiosSecure();
    const { user, loading, refetchUserData } = useUserData();
    const { data, isLoading } = useUserDataQuery(user?.id);

    const handleCashOut = async (e) => {
        e.preventDefault();

        try {
            await axiosSecure.post('/cash-out', {
                identifier,
                amount: parseFloat(amount),
                pin
            }, { withCredentials: true });

            await saveTransactionHistory({
                email: data?.email,
                recipient: identifier,
                amount: parseFloat(amount),
                fee: parseFloat(amount) * 0.015,
                totalAmount: parseFloat(amount) + (parseFloat(amount) * 0.015),
                timestamp: new Date().toISOString(),
                category: 'Cash Out',
                status: 'pending',
            });

            Toast.fire({
                icon: 'success',
                title: 'Cash-out request sent successfully!',
            });

            setIdentifier('');
            setAmount('');
            setPin('');
            setMessage('');
            setMsg(null);

            await refetchUserData();
            setModalOpen(false);
        } catch (error) {
            ErrorToast.fire({
                icon: 'error',
                title: error.response.data?.message || 'Cash out failed',
            });
        }
    };

    const saveTransactionHistory = async (transactionData) => {
        try {
            await axiosSecure.post('/save-transaction', transactionData, { withCredentials: true });
        } catch (error) {
            ErrorToast.fire({
                icon: 'error',
                title: error.response?.data?.message || 'Transaction request failed',
            });
        }
    };

    const validateAgent = useCallback(async () => {
        try {
            const response = await axiosSecure.post('/validate-cash-out', {
                identifier,
                amount: parseFloat(amount)
            }, { withCredentials: true });

            return response.data.isValid;
        } catch (error) {
            setMsg('')
            setMessage(error.response?.data?.message || 'Validation failed');
            return false;
        }
    }, [identifier, amount, axiosSecure]);

    useEffect(() => {
        const updateMessage = async () => {
            if (!identifier || !amount) {
                setMessage('');
                setMsg(null);
                return;
            }

            const isValidAgent = await validateAgent();
            if (!isValidAgent) return;

            const fee = parseFloat(amount) * 0.015;
            const totalAmount = parseFloat(amount) + fee;
            const userBalance = data?.balance || 0;

            if (userBalance < totalAmount) {
                setMessage('Insufficient balance for this transaction');
                setMsg(null);
            } else {
                setMessage('');
                setMsg(
                    <div className='text-gray-600 flex flex-wrap justify-between text-right my-4'>
                        <p className='flex flex-col font-light'>Amount<span className='text-sky-600 font-medium'>BDT { amount }</span></p>
                        <p className='flex flex-col font-light'>+ Fee <span className='text-sky-600 font-medium'>BDT { fee.toFixed(2) }</span></p>
                        <p className='flex flex-col font-light'>Total <span className='text-sky-600 font-medium'>BDT { totalAmount.toFixed(2) }</span></p>
                    </div>
                );
            }
        };
        updateMessage();
    }, [identifier, amount, data?.balance, validateAgent]);

    const openModal = async () => {
        if (identifier && amount) {
            const isValid = await validateAgent();
            if (isValid) {
                setModalOpen(true);
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setPin('');
    };

    if (isLoading || loading) {
        return <Loading />;
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 w-full'>
            <div className='flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md'>
                <h1 className='self-center text-3xl text-blue-600 font-bold mb-4'>Cash Out</h1>
                <p className='text-center text-blue-400 font-light sm:text-sm italic'>A fee of 1.5% will be deducted from your balance for every transaction.</p>
                <CashOutForm
                    identifier={ identifier }
                    setIdentifier={ setIdentifier }
                    amount={ amount }
                    setAmount={ setAmount }
                    handleFormSubmit={ (e) => { e.preventDefault(); openModal(); } }
                />
                { message && <p className='text-red-500 text-center font-medium my-4'>{ message }</p> }
                { msg && (<>{ msg }</>) }
                <div className='flex justify-center items-center mt-6'>
                    <p className='inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-center ml-2 text-sm'>Available Balance: <span>
                        <svg className='h-4 w-4' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                            <path stroke='none' d='M0 0h24v24H0z' />
                            <path d='M17.5 15.5 A1 1 0 0 1 16.5 16.5 A1 1 0 0 1 15.5 15.5 A1 1 0 0 1 17.5 15.5 z' />
                            <path d='M7 7a2 2 0 114 0v9a3 3 0 006 0v-.5M8 11h6' />
                        </svg>
                    </span>{ data?.balance }</p>
                </div>
            </div>
            <CashOutModal
                modalOpen={ modalOpen }
                closeModal={ closeModal }
                handleCashOut={ handleCashOut }
                pin={ pin }
                setPin={ setPin }
            />
        </div>
    );
};

export default CashOut;