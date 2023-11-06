import {createBrowserRouter} from "react-router-dom";
import Root from "./Root";
import {lazy} from "react";
import HomePage from "./Home";
import Login from "./User/Login.tsx";

const About = lazy(() => import('./About'));
const Register = lazy(() => import('./User/Register'));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Root/>
        ),
        children: [
            {path: "", element: <HomePage/>},
            {path: "about", element: <About/>},
            {path: "user/register", element: <Register/>},
            {path: "user/login", element: <Login/>}
        ]
    },
]);

export default router;