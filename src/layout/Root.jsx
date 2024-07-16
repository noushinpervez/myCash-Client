import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const Root = () => {
    const location = useLocation();
    const noSideBar = location.pathname.includes('login') || location.pathname.includes('signup');

    return (
        <>
            <ScrollRestoration />
            { noSideBar || <Sidebar /> }
            { noSideBar && <Outlet /> }
        </>
    );
};

export default Root;