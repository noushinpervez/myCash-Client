import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout/Root';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUp';
import Profile from '../pages/Dashboard/Profile/Profile';
import PrivateRoute from './PrivateRoute';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers/ManageUsers';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import Statements from '../pages/Dashboard/Statements/Statements';
import SendMoney from '../pages/Dashboard/SendMoney/SendMoney';
import CashIn from '../pages/Dashboard/CashIn/CashIn';
import CashOut from '../pages/Dashboard/CashOut/CashOut';
import Transactions from '../pages/Dashboard/Agent/Transactions/Transactions';
import UserActiveRoute from './UserActiveRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,

        children: [
            {
                path: '/',
                element: <PrivateRoute>
                    <Profile />
                </PrivateRoute>,
            },
            {
                path: 'manage-users',
                element: <PrivateRoute>
                    <ManageUsers />
                </PrivateRoute>,
            },
            {
                path: 'statement',
                element: <UserActiveRoute>
                    <Statements />
                </UserActiveRoute>,
            },
            {
                path: 'send-money',
                element: <UserActiveRoute>
                    <SendMoney />
                </UserActiveRoute>,
            },
            {
                path: 'cash-in',
                element: <UserActiveRoute>
                    <CashIn />
                </UserActiveRoute>,
            },
            {
                path: 'cash-out',
                element: <UserActiveRoute>
                    <CashOut />
                </UserActiveRoute>,
            },
            {
                path: 'requests',
                element: <UserActiveRoute>
                    <Transactions />
                </UserActiveRoute>,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'signup',
                element: <SignUp />,
            },
        ],
    },
]);