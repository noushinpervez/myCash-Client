import PropTypes from 'prop-types';

const Pagination = ({ length, totalCount, currentPage, totalPages, onPageChange, text }) => {
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    return (
        <div className='flex flex-col items-center mt-8'>
            {
                length >= 1 &&
                <div className='text-sm text-gray-500 font-medium'>
                    Showing { length } of { totalCount } { text }
                </div>
            }
            { totalPages > 1 && (
                <ol className='mt-4 flex gap-1 text-xs font-medium'>
                    <li>
                        <button
                            onClick={ () => handlePageChange(currentPage - 1) }
                            disabled={ currentPage === 1 }
                            className='inline-flex sm:size-8 size-9 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'
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
                        <li key={ index }>
                            <button
                                onClick={ () => handlePageChange(index + 1) }
                                className={ `block rounded-md border sm:size-8 size-9 text-center leading-8 ${currentPage === index + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border border-gray-100 bg-white text-gray-900'}` }
                            >
                                { index + 1 }
                            </button>
                        </li>
                    )) }
                    <li>
                        <button
                            onClick={ () => handlePageChange(currentPage + 1) }
                            disabled={ currentPage === totalPages }
                            className='inline-flex sm:size-8 size-9 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'
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
            ) }
        </div>
    );
};

Pagination.propTypes = {
    length: PropTypes.number,
    totalCount: PropTypes.number,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func,
    text: PropTypes.string,
};

export default Pagination;