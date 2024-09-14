const getTransactionDetails = (userData, user, transaction) => {
    const isCashIn = transaction?.category === 'Cash In';
    const isCashOut = transaction?.category === 'Cash Out';
    const isSendMoney = transaction?.category === 'Send Money';
    const isCurrentUser = transaction?.email === userData?.email || transaction?.email === userData?.number;
    const isRecipient = transaction?.recipient === userData?.email || transaction?.recipient === userData?.number;

    // If the transaction amount should be considered positive
    const isPositive = (
        (isCashIn && user?.role !== 'Agent') ||
        (isCashOut && !isCurrentUser && user?.role === 'Agent') ||
        (isSendMoney && isRecipient)
    );

    const sign = isPositive ? '+' : '-';
    const colorClass = isPositive ? 'text-blue-500' : 'text-red-500';

    // If there is a charge
    const charge = transaction?.fee > 0 &&
        (isCurrentUser || user?.role === 'Admin')
        ? `Charge BDT ${transaction?.fee}`
        : 'No Charge';

    const statusMsg = isRecipient
        ? (user?.role === 'Agent' && (isCashIn || isCashOut) ? transaction?.status : 'Received')
        : isCashIn || isCashOut ? transaction?.status : 'Sent';

    return { sign, colorClass, isRecipient, statusMsg, charge };
};

export default getTransactionDetails;