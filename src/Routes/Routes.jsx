import { createBrowserRouter } from 'react-router-dom'
import Root from '../layout/Root'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import Profile from '../pages/Dashboard/Profile/Profile'
import PrivateRoute from './PrivateRoute'
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers/ManageUsers'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,

        children: [
            {
                path: '/',
                element: <PrivateRoute>
                    <Profile />
                </PrivateRoute>,
            },
            {
                path: '/manage-users',
                element: <PrivateRoute>
                    <ManageUsers />
                </PrivateRoute>,
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