import { Outlet, ScrollRestoration } from 'react-router-dom'

const Root = () => {
    return (
        <>
            <ScrollRestoration />
            <Outlet />
        </>
    );
};

export default Root;