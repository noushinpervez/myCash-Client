import { useState } from 'react';
import PropTypes from 'prop-types';
import Visible from '../../../assets/Visible.jsx';
import Hidden from '../../../assets/Hidden.jsx';

const CashInModal = ({ modalOpen, closeModal, handleCashIn, pin, setPin }) => {
    const [pinVisible, setPinVisible] = useState(false);

    const togglePinVisibility = () => {
        setPinVisible(!pinVisible);
    };

    return (
        <>
            { modalOpen && (
                <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4'>
                    <div className='bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md'>
                        <h2 className='mb-4 text-center text-2xl text-blue-600 font-bold'>Enter PIN to Confirm</h2>
                        <form onSubmit={ handleCashIn }>
                            <div className='flex flex-col mb-6'>
                                <label htmlFor='pin' className='mb-1 text-xs sm:text-sm tracking-wide text-gray-600 font-semibold'>Pin</label>
                                <div className='relative'>
                                    <div className='inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400'>
                                        <span>
                                            <svg className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                            </svg>
                                        </span>
                                    </div>
                                    <input
                                        id='pin'
                                        type={ pinVisible ? 'text' : 'password' }
                                        name='pin'
                                        pattern='[0-9]{5}'
                                        maxLength='5'
                                        onInput={ (event) => {
                                            event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                        } }
                                        onChange={ (e) => setPin(e.target.value) }
                                        value={ pin }
                                        className='placeholder-gray-500 pl-10 pr-4 rounded-md border border-gray-400 w-full py-3 focus:outline-none focus:border-blue-400'
                                        placeholder='*****'
                                        autoComplete=''
                                        required
                                    />
                                    <button
                                        type='button'
                                        onClick={ togglePinVisibility }
                                        className='absolute right-0 top-0 h-full px-3 flex items-center text-gray-400'
                                    >
                                        { pinVisible ? <Visible /> : <Hidden /> }
                                    </button>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <button type='button' onClick={ closeModal } className='mr-2 px-4 py-3 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300'>Cancel</button>
                                <button type='submit' className='px-4 py-3 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring focus:ring-offset-2 focus:ring-blue-600'>Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) }
        </>
    );
};

CashInModal.propTypes = {
    modalOpen: PropTypes.bool,
    closeModal: PropTypes.func,
    handleCashIn: PropTypes.func,
    pin: PropTypes.string,
    setPin: PropTypes.func,
};

export default CashInModal;