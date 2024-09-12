import { useCallback, useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUserData from '../../../hooks/useUserData';
import useUserDataQuery from '../../../hooks/useUserDataQuery';
import Loading from '../../../components/Loading';
import ErrorToast from '../../../components/ErrorToast';
import Toast from '../../../components/Toast';
import CashInForm from './CashInForm';
import CashInModal from './CashInModal';

const CashIn = () => {
    const [identifier, setIdentifier] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [message, setMessage] = useState('');
    const [msg, setMsg] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const axiosSecure = useAxiosSecure();
    const { user, loading, refetchUserData } = useUserData();
    const { data, isLoading } = useUserDataQuery(user?.id);

    const handleCashIn = async (e) => {
        e.preventDefault();

        try {
            await axiosSecure.post('/cash-in', {
                identifier,
                amount: parseFloat(amount),
                pin
            }, { withCredentials: true });

            await saveTransactionHistory({
                email: data?.email,
                recipient: identifier,
                amount: parseFloat(amount),
                fee: 0,
                totalAmount: parseFloat(amount),
                timestamp: new Date().toISOString(),
                category: 'Cash In',
                status: 'pending'
            });

            Toast.fire({
                icon: 'success',
                title: 'Cash-in request sent successfully!',
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
                title: error.response.data?.message || 'Cash in request failed',
            });
        }
    };

    const saveTransactionHistory = async (transactionData) => {
        try {
            await axiosSecure.post('/save-transaction', transactionData, { withCredentials: true });
        } catch (error) {
            ErrorToast.fire({
                icon: 'error',
                title: error.response?.data?.message || 'Transaction saving failed',
            });
        }
    };

    const validateAgent = useCallback(async () => {
        try {
            const response = await axiosSecure.post('/validate-agent-cashin', {
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

            setMessage('');
            setMsg(
                <div className='text-gray-600 flex flex-wrap justify-between text-right my-4'>
                    <p className='flex flex-col'>Amount<span className='text-sky-600 font-medium'>BDT { amount }</span></p>
                    <p className='flex flex-col'>Total <span className='text-sky-600 font-medium'>BDT { amount }</span></p>
                </div>
            );
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
                <div className='font-medium self-center text-xl sm:text-2xl uppercase text-gray-800'>Cash In</div>
                <CashInForm
                    identifier={ identifier }
                    setIdentifier={ setIdentifier }
                    amount={ amount }
                    setAmount={ setAmount }
                    handleFormSubmit={ (e) => { e.preventDefault(); openModal(); } }
                />
                { message && <p className='text-red-500 text-center font-semibold my-2'>{ message }</p> }
                { msg && (<>{ msg }</>) }
            </div>
            <CashInModal
                modalOpen={ modalOpen }
                closeModal={ closeModal }
                handleCashIn={ handleCashIn }
                pin={ pin }
                setPin={ setPin }
            />
        </div>
    );
};

export default CashIn;