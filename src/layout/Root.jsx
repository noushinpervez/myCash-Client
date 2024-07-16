import { Outlet, ScrollRestoration } from 'react-router-dom'
import Sidebar from '../layout/Sidebar'
import SignUp from '../pages/SignUp/SignUp'

const Root = () => {
    return (
        <>
            <ScrollRestoration />
            <SignUp />
            <Outlet />
        </>
    );
};

export default Root;