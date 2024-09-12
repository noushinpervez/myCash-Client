import PropTypes from 'prop-types';

const CashOutModal = ({ modalOpen, closeModal, handleCashOut, pin, setPin }) => {
    return (
        <>
            { modalOpen && (
                <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white rounded-md shadow-md p-4 w-full max-w-md'>
                        <h2 className='text-lg font-medium mb-4'>Enter PIN to Confirm</h2>
                        <form onSubmit={ handleCashOut }>
                            <div className='flex flex-col mb-6'>
                                <label htmlFor='pin' className='mb-1 text-xs sm:text-sm tracking-wide text-gray-600'>Pin</label>
                                <div className='relative'>
                                    <div className='inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400'>
                                        <span>
                                            <svg className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                            </svg>
                                        </span>
                                    </div>
                                    <input id='pin' type='password' name='pin' pattern='[0-9]{5}' maxLength='5' onInput={ (event) => {
                                        event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                    } } onChange={ (e) => setPin(e.target.value) } value={ pin } className='text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400' placeholder='*****' autoComplete='' required />
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <button type='button' onClick={ closeModal } className='mr-2 px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300'>Cancel</button>
                                <button type='submit' className='px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700'>Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) }
        </>
    );
};

CashOutModal.propTypes = {
    modalOpen: PropTypes.bool,
    closeModal: PropTypes.func,
    handleCashOut: PropTypes.func,
    pin: PropTypes.string,
    setPin: PropTypes.func,
};

export default CashOutModal;