import PropTypes from 'prop-types';

const CashOutForm = ({ identifier, setIdentifier, amount, setAmount, handleFormSubmit }) => {
    return (
        <div className='mt-10'>
            <form onSubmit={ handleFormSubmit }>
                <div className='flex flex-col mb-6'>
                    <label htmlFor='identifier' className='mb-1 text-xs sm:text-sm tracking-wide text-gray-600 font-semibold'>Agent Email/Mobile Number</label>
                    <div className='relative'>
                        <div className='inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400'>
                            <svg className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                                <path d='M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471' stroke='currentColor' strokeWidth='2' strokeLinecap='round'></path>
                                <circle cx='12' cy='8' r='4' stroke='currentColor' strokeWidth='2' strokeLinecap='round'></circle>
                            </svg>
                        </div>
                        <input id='identifier' type='text' name='identifier' onInput={ (event) => {
                            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            const mobilePattern = /^01[0-9]{9}$/;
                            const input = event.target;
                            const value = input.value;

                            if (emailPattern.test(value)) {
                                input.setCustomValidity('');
                            } else if (mobilePattern.test(value)) {
                                input.setCustomValidity('');
                            } else {
                                input.setCustomValidity('Please enter a valid email address or a valid mobile number starting with 01 and exactly 11 digits long.');
                            }
                        } } value={ identifier } className='placeholder-gray-500 pl-10 pr-4 rounded-md border border-gray-400 w-full py-3 focus:outline-none focus:border-blue-400' placeholder='Email or Mobile Number' onChange={ (e) => setIdentifier(e.target.value) } required />
                    </div>
                </div>
                <div className='flex flex-col mb-6'>
                    <label htmlFor='amount' className='mb-1 text-xs sm:text-sm tracking-wide text-gray-600 font-semibold'>Amount</label>
                    <div className='relative'>
                        <div className='inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400'>
                            <svg className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                                <path stroke='none' d='M0 0h24v24H0z' />
                                <path d='M17.5 15.5 A1 1 0 0 1 16.5 16.5 A1 1 0 0 1 15.5 15.5 A1 1 0 0 1 17.5 15.5 z' />
                                <path d='M7 7a2 2 0 114 0v9a3 3 0 006 0v-.5M8 11h6' />
                            </svg>
                        </div>
                        <input id='amount' type='number' name='amount' value={ amount } className='placeholder-gray-500 pl-10 pr-4 rounded-md border border-gray-400 w-full py-3 focus:outline-none focus:border-blue-400' placeholder='0' onChange={ (e) => {
                            const value = e.target.value;
                            if (value.length <= 6) {
                                setAmount(value);
                            }
                        } } required />
                    </div>
                </div>
                <div className='flex w-full'>
                    <button type='submit' className='flex items-center justify-center focus:outline-none text-white font-medium bg-blue-600 hover:bg-blue-700 rounded py-3 w-full transition duration-150 ease-in'>
                        <span className='mr-2 uppercase'>Proceed &rarr;</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

CashOutForm.propTypes = {
    identifier: PropTypes.string,
    setIdentifier: PropTypes.func,
    amount: PropTypes.string,
    setAmount: PropTypes.func,
    handleFormSubmit: PropTypes.func,
};

export default CashOutForm;