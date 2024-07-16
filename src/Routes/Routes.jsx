import { createBrowserRouter } from 'react-router-dom'
import Root from '../layout/Root'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import Profile from '../pages/Dashboard/Profile/Profile'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,

        children: [
            {
                path: "/",
                element: <Profile />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "signup",
                element: <SignUp />,
            },
        ],
    },
]);